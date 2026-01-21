import { Request, Response } from 'express';
import Trade from '../models/Trade';
import { AuthRequest } from '../middleware/auth';
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from 'date-fns';

// @desc    Get trading calendar data for a specific month
// @route   GET /api/trades/calendar?month=2026-01
// @access  Private
export const getTradeCalendar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const monthParam = req.query.month as string;

        // Parse month parameter (format: YYYY-MM)
        const targetDate = monthParam ? new Date(`${monthParam}-01`) : new Date();
        const monthStart = startOfMonth(targetDate);
        const monthEnd = endOfMonth(targetDate);

        // Fetch all trades for the month
        const trades = await Trade.find({
            userId,
            entryDate: {
                $gte: monthStart,
                $lte: monthEnd
            }
        }).sort({ entryDate: 1 });

        // Group trades by day
        const dayMap = new Map<string, { profit: number; volume: number; count: number }>();

        trades.forEach(trade => {
            const dateKey = format(trade.entryDate, 'yyyy-MM-dd');
            const existing = dayMap.get(dateKey) || { profit: 0, volume: 0, count: 0 };

            dayMap.set(dateKey, {
                profit: existing.profit + trade.profitLoss,
                volume: existing.volume + Math.abs(trade.profitLoss), // Total volume traded
                count: existing.count + 1
            });
        });

        // Generate all days in month
        const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const calendarDays = allDays.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayData = dayMap.get(dateKey);

            return {
                date: dateKey,
                dayOfMonth: format(day, 'd'),
                profit: dayData?.profit || 0,
                volume: dayData?.volume || 0,
                tradeCount: dayData?.count || 0,
                hasTrading: !!dayData
            };
        });

        // Calculate summary
        const totalProfit = Array.from(dayMap.values())
            .reduce((sum, day) => sum + day.profit, 0);
        const totalVolume = Array.from(dayMap.values())
            .reduce((sum, day) => sum + day.volume, 0);
        const totalTrades = trades.length;

        res.json({
            success: true,
            month: format(targetDate, 'yyyy-MM'),
            summary: {
                totalProfit,
                totalVolume,
                totalTrades,
                profitableDays: Array.from(dayMap.values()).filter(d => d.profit > 0).length,
                totalDays: dayMap.size
            },
            days: calendarDays
        });

    } catch (error: any) {
        console.error('Get calendar error:', error);
        res.status(500).json({ error: 'Failed to fetch calendar data' });
    }
};
