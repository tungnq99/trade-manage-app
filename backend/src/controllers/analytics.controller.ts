import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Trade from '../models/Trade';
import Capital from '../models/Capital';
import { AuthRequest } from '../middleware/auth';

// @desc    Get key performance statistics (Win Rate, Profit Factor, etc.)
// @route   GET /api/analytics/stats
// @access  Private
export const getAnalyticsStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        // Force cast for strict typing in aggregation
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const stats = await Trade.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: null,
                    totalTrades: { $sum: 1 },
                    winningTrades: {
                        $sum: { $cond: [{ $gt: ['$profitLoss', 0] }, 1, 0] }
                    },
                    losingTrades: {
                        $sum: { $cond: [{ $lt: ['$profitLoss', 0] }, 1, 0] }
                    },
                    breakEvenTrades: {
                        $sum: { $cond: [{ $eq: ['$profitLoss', 0] }, 1, 0] }
                    },
                    grossProfit: {
                        $sum: { $cond: [{ $gt: ['$profitLoss', 0] }, '$profitLoss', 0] }
                    },
                    grossLoss: {
                        $sum: { $cond: [{ $lt: ['$profitLoss', 0] }, '$profitLoss', 0] }
                    },
                    totalNetProfit: { $sum: '$profitLoss' },
                    totalLots: { $sum: '$lotSize' } // Sum of all lot sizes
                }
            },
            {
                $project: {
                    _id: 0,
                    totalTrades: 1,
                    winningTrades: 1,
                    losingTrades: 1,
                    breakEvenTrades: 1,
                    totalNetProfit: 1,
                    grossProfit: 1,
                    grossLoss: 1,
                    totalLots: 1, // Include total lots in output
                    winRate: {
                        $cond: [
                            { $gt: ['$totalTrades', 0] },
                            { $multiply: [{ $divide: ['$winningTrades', '$totalTrades'] }, 100] },
                            0
                        ]
                    },
                    profitFactor: {
                        $cond: [
                            { $ne: ['$grossLoss', 0] },
                            { $divide: ['$grossProfit', { $abs: '$grossLoss' }] },
                            { $cond: [{ $gt: ['$grossProfit', 0] }, 999, 0] } // Infinite PF if no loss but has profit
                        ]
                    },
                    averageWin: {
                        $cond: [
                            { $gt: ['$winningTrades', 0] },
                            { $divide: ['$grossProfit', '$winningTrades'] },
                            0
                        ]
                    },
                    averageLoss: {
                        $cond: [
                            { $gt: ['$losingTrades', 0] },
                            { $divide: ['$grossLoss', '$losingTrades'] }, // This will be negative
                            0
                        ]
                    }
                }
            }
        ]);

        // If no trades found, return zeroed stats
        const result = stats.length > 0 ? stats[0] : {
            totalTrades: 0,
            winningTrades: 0,
            losingTrades: 0,
            breakEvenTrades: 0,
            totalNetProfit: 0,
            grossProfit: 0,
            grossLoss: 0,
            winRate: 0,
            profitFactor: 0,
            averageWin: 0,
            averageLoss: 0
        };

        // Calculate Expectancy in JS because it's easier to handle nulls/zeros logic cleanly
        // Expectancy = (Win% * AvgWin) - (Loss% * AvgLoss) -> Note: AvgLoss is usually negative in our logic above
        let expectancy = 0;
        if (result.totalTrades > 0) {
            expectancy = result.totalNetProfit / result.totalTrades;
        }

        res.status(200).json({
            ...result,
            expectancy
        });

    } catch (error) {
        console.error('Error fetching analytics stats:', error);
        res.status(500).json({ message: 'Server error fetching analytics stats' });
    }
};

// @desc    Get equity curve data (Time-series balance)
// @route   GET /api/analytics/equity-curve
// @access  Private
export const getEquityCurve = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // 1. Get Initial Capital
        const capital = await Capital.findOne({ userId });
        const initialBalance = capital?.initialBalance || 0;

        // 2. Aggregate Daily P/L
        // We group by date to get the net result for each trading day
        const dailyResults = await Trade.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$entryDate" } },
                    netProfit: { $sum: "$profitLoss" },
                    tradesCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Sort by date ascending
        ]);

        // 3. Build Cumulative Curve
        // Initialize with starting balance
        let currentBalance = initialBalance;
        const equityCurve = dailyResults.map(day => {
            currentBalance += day.netProfit;
            return {
                date: day._id,
                balance: currentBalance,
                dailyProfit: day.netProfit,
                trades: day.tradesCount
            };
        });

        // Add initial point if needed (optional, helps chart look better)
        if (equityCurve.length > 0) {
            // Prepend start point a day before first trade
            const firstDate = new Date(equityCurve[0].date);
            firstDate.setDate(firstDate.getDate() - 1);

            equityCurve.unshift({
                date: firstDate.toISOString().split('T')[0],
                balance: initialBalance,
                dailyProfit: 0,
                trades: 0
            });
        } else {
            // No trades, return just initial balance
            equityCurve.push({
                date: new Date().toISOString().split('T')[0],
                balance: initialBalance,
                dailyProfit: 0,
                trades: 0
            });
        }

        res.status(200).json(equityCurve);

    } catch (error) {
        console.error('Error fetching equity curve:', error);
        res.status(500).json({ message: 'Server error fetching equity curve' });
    }
};

// @desc    Get performance breakdown by symbol
// @route   GET /api/analytics/breakdown-by-symbol
// @access  Private
export const getBreakdownBySymbol = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const breakdown = await Trade.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: "$symbol",
                    totalTrades: { $sum: 1 },
                    totalPnl: { $sum: "$profitLoss" },
                    wonTrades: { $sum: { $cond: [{ $gt: ["$profitLoss", 0] }, 1, 0] } }
                }
            },
            {
                $project: {
                    symbol: "$_id",
                    totalTrades: 1,
                    totalPnl: 1,
                    winRate: {
                        $cond: [
                            { $gt: ["$totalTrades", 0] },
                            { $multiply: [{ $divide: ["$wonTrades", "$totalTrades"] }, 100] },
                            0
                        ]
                    }
                }
            },
            { $sort: { totalPnl: -1 } } // Sort by most profitable
        ]);

        res.status(200).json(breakdown);
    } catch (error) {
        console.error('Error fetching symbol breakdown:', error);
        res.status(500).json({ message: 'Server error fetching symbol breakdown' });
    }
};

// @desc    Get performance breakdown by session
// @route   GET /api/analytics/breakdown-by-session
// @access  Private
export const getBreakdownBySession = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const userObjectId = new mongoose.Types.ObjectId(userId);

        const breakdown = await Trade.aggregate([
            { $match: { userId: userObjectId } },
            {
                $group: {
                    _id: "$session",
                    totalTrades: { $sum: 1 },
                    totalPnl: { $sum: "$profitLoss" },
                    wonTrades: { $sum: { $cond: [{ $gt: ["$profitLoss", 0] }, 1, 0] } }
                }
            },
            {
                $project: {
                    session: "$_id",
                    totalTrades: 1,
                    totalPnl: 1,
                    winRate: {
                        $cond: [
                            { $gt: ["$totalTrades", 0] },
                            { $multiply: [{ $divide: ["$wonTrades", "$totalTrades"] }, 100] },
                            0
                        ]
                    }
                }
            },
            { $sort: { totalPnl: -1 } }
        ]);

        res.status(200).json(breakdown);
    } catch (error) {
        console.error('Error fetching session breakdown:', error);
        res.status(500).json({ message: 'Server error fetching session breakdown' });
    }
};
