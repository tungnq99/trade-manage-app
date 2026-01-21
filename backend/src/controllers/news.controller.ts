import { Request, Response } from 'express';
import EconomicEvent from '../models/EconomicEvent';
import { AuthRequest } from '../middleware/auth';

// @desc    Get economic calendar events
// @route   GET /api/news/calendar
// @access  Private
export const getCalendar = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Parse query parameters
        const dateFrom = req.query.dateFrom
            ? new Date(req.query.dateFrom as string)
            : new Date(); // Default: today

        const dateTo = req.query.dateTo
            ? new Date(req.query.dateTo as string)
            : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Default: +7 days

        const currencies = req.query.currencies
            ? (req.query.currencies as string).split(',').map(c => c.toUpperCase())
            : ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD']; // All

        const impact = req.query.impact as string | undefined;

        // Build query
        const query: any = {
            date: {
                $gte: dateFrom,
                $lte: dateTo
            },
            currency: { $in: currencies }
        };

        if (impact && ['High', 'Medium', 'Low'].includes(impact)) {
            query.impact = impact;
        }

        // Fetch events
        const events = await EconomicEvent.find(query)
            .sort({ date: 1 }) // Sort by date ascending
            .lean();

        res.status(200).json({
            success: true,
            data: {
                events,
                total: events.length
            }
        });

    } catch (error) {
        console.error('Error fetching economic calendar:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching economic calendar'
        });
    }
};
