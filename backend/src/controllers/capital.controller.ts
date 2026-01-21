import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Capital from '../models/Capital';
import Trade from '../models/Trade';
import { AuthRequest } from '../middleware/auth';

// @desc    Get capital summary (Initial + Realized P/L)
// @route   GET /api/capital/summary
// @access  Private
export const getCapitalSummary = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        // 1. Get Capital Settings (Initial Balance)
        let capital = await Capital.findOne({ userId });

        if (!capital) {
            // If no settings exist, return defaults (or we could auto-create one)
            // For now, let's treat it as 0 balance
            res.status(200).json({
                initialBalance: 0,
                currentBalance: 0,
                totalProfit: 0,
                totalTrades: 0,
                currency: 'USD',
                isOnboardingRequired: true
            });
            return;
        }

        // 2. Aggregate Total Profit/Loss from CLOSED trades
        // We only care about realized P/L for balance calculation.
        // Assuming 'exitDate' or 'exitPrice' existing means closed? 
        // Based on our Trade model, all trades currently inserted seem to be "logs" (history), so they are closed.
        // If we support open trades later, we need a 'status' field or check exitPrice.
        // For now, sum all 'profitLoss' from Trade collection.

        const aggregationResult = await Trade.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalProfit: { $sum: '$profitLoss' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalProfit = aggregationResult.length > 0 ? aggregationResult[0].totalProfit : 0;
        const totalTrades = aggregationResult.length > 0 ? aggregationResult[0].count : 0;

        // 3. Calculate Current Balance
        const currentBalance = capital.initialBalance + totalProfit;

        // 4. Calculate Peak Balance (highest balance ever reached)
        // For now, use current balance as peak. In production, you'd track this in DB.
        const peakBalance = Math.max(capital.initialBalance, currentBalance);

        // 5. Calculate Today's Profit (filter trades by today's date)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dailyAggregation = await Trade.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    entryDate: {
                        $gte: today,        // Use Date object, not .toISOString()
                        $lt: tomorrow       // Use Date object, not .toISOString()
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    dailyProfit: { $sum: '$profitLoss' }
                }
            }
        ]);

        const dailyProfit = dailyAggregation.length > 0 ? dailyAggregation[0].dailyProfit : 0;

        res.status(200).json({
            initialBalance: capital.initialBalance,
            currentBalance,
            totalProfit,
            totalTrades,
            currency: capital.currency,
            riskPerTradePercent: capital.riskPerTradePercent,
            dailyLossLimit: capital.dailyLossLimit,
            maxDrawdown: capital.maxDrawdown,
            dailyCapTarget: capital.dailyCapTarget,
            peakBalance,
            dailyProfit,
            isOnboardingRequired: capital.initialBalance === 0 // Helper flag for frontend
        });

    } catch (error) {
        console.error('Error getting capital summary:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update or Set Capital Settings
// @route   POST /api/capital/settings
// @access  Private
export const updateCapitalSettings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { initialBalance, currency, riskPerTradePercent, dailyLossLimit, maxDrawdown, dailyCapTarget } = req.body;

        if (initialBalance === undefined || initialBalance < 0) {
            res.status(400).json({ message: 'Initial balance must be a positive number' });
            return;
        }

        // Upsert logic: Update if exists, Create if not
        const capital = await Capital.findOneAndUpdate(
            { userId },
            {
                $set: {
                    initialBalance,
                    currency: currency || 'USD',
                    riskPerTradePercent: riskPerTradePercent || 1,
                    dailyLossLimit: dailyLossLimit || 5,
                    maxDrawdown: maxDrawdown || 10,
                    dailyCapTarget: dailyCapTarget || 2500
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.status(200).json(capital);

    } catch (error) {
        console.error('Error updating capital settings:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
