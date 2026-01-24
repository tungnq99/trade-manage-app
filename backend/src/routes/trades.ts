

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import Trade from '../models/Trade';
import { protect } from '../middleware/auth';

const router = Router();

// Validation schema for creating a trade
const tradeSchema = z.object({
    symbol: z.string().min(1, 'Symbol is required').toUpperCase(),
    direction: z.enum(['long', 'short']),
    entryDate: z.string().transform((str) => new Date(str)),
    entryTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    entryPrice: z.number().positive(),
    lotSize: z.number().positive(),
    exitDate: z.string().transform((str) => new Date(str)),
    exitTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    exitPrice: z.number().positive(),
    setup: z.string().min(1, 'Setup is required'),
    notes: z.string().optional(),
    screenshot: z.string().optional(),
    session: z.enum(['asian', 'london', 'newyork', 'overlap']),
    tp: z.number().positive(),
    sl: z.number().positive(),
    // Calculated fields (can be provided by FE or calc by BE, here we require them for simplicity in Sprint 1)
    pips: z.number(),
    profitLoss: z.number(),
    profitLossPercent: z.number(),
});

// POST /api/trades - Create a new trade
router.post('/', protect, async (req: Request, res: Response) => {
    try {
        // Validate input
        const validatedData = tradeSchema.parse(req.body);

        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // Create trade
        const trade = new Trade({
            ...validatedData,
            userId: req.user.userId,
            importSource: 'manual',
        });

        const savedTrade = await trade.save();

        res.status(201).json({
            success: true,
            trade: savedTrade,
            message: 'Trade created successfully',
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message, details: error.errors });
        }
        console.error('Create trade error:', error);
        res.status(500).json({ error: 'Failed to create trade', details: error.message });
    }
});

// GET /api/trades - List trades with pagination and filters
router.get('/', protect, async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 20, symbol, direction, startDate, endDate } = req.query;
        const userId = req.user?.userId;

        const query: any = { userId };

        // Apply filters
        if (symbol) query.symbol = symbol;
        if (direction) query.direction = direction;
        if (startDate || endDate) {
            query.entryDate = {};
            if (startDate) query.entryDate.$gte = new Date(startDate as string);
            if (endDate) query.entryDate.$lte = new Date(endDate as string);
        }

        // Execute query with pagination
        const trades = await Trade.find(query)
            .sort({ entryDate: -1, entryTime: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        const total = await Trade.countDocuments(query);

        res.json({
            success: true,
            trades,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error: any) {
        console.error('List trades error:', error);
        res.status(500).json({ error: 'Failed to fetch trades' });
    }
});

// GET /api/trades/:id - Get single trade
router.get('/:id', protect, async (req: Request, res: Response) => {
    try {
        const trade = await Trade.findOne({
            _id: req.params.id,
            userId: req.user?.userId,
        });

        if (!trade) {
            return res.status(404).json({ error: 'Trade not found' });
        }

        res.json({ success: true, trade });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trade' });
    }
});

// PUT /api/trades/:id - Update trade
router.put('/:id', protect, async (req: Request, res: Response) => {
    try {
        const trade = await Trade.findOne({
            _id: req.params.id,
            userId: req.user?.userId,
        });

        if (!trade) {
            return res.status(404).json({ error: 'Trade not found' });
        }

        // Update fields
        Object.assign(trade, req.body);

        // basic validation could happen here or rely on Mongoose/Zod partial
        // For now, assume partial updates are valid if they match type

        const updatedTrade = await trade.save();
        res.json({ success: true, trade: updatedTrade, message: 'Trade updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update trade' });
    }
});

// DELETE /api/trades/:id - Delete trade
router.delete('/:id', protect, async (req: Request, res: Response) => {
    try {
        const deletedTrade = await Trade.findOneAndDelete({
            _id: req.params.id,
            userId: req.user?.userId,
        });

        if (!deletedTrade) {
            return res.status(404).json({ error: 'Trade not found' });
        }

        res.json({ success: true, message: 'Trade deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete trade' });
    }
});

export default router;
