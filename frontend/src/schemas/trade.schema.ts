import { z } from 'zod';

// Validation schema for creating a trade
export const createTradeSchema = z.object({
    symbol: z.string().min(1, 'Symbol is required').toUpperCase(),
    direction: z.enum(['long', 'short'], { required_error: 'Direction is required' }),
    entryDate: z.string().min(1, 'Entry date is required'),
    entryTime: z
        .string()
        .min(1, 'Entry time is required')
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    entryPrice: z.coerce.number().positive('Entry price must be positive'),
    lotSize: z.coerce.number().positive('Lot size must be positive'),
    exitDate: z.string().min(1, 'Exit date is required'),
    exitTime: z
        .string()
        .min(1, 'Exit time is required')
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    exitPrice: z.coerce.number().positive('Exit price must be positive'),
    tp: z.coerce.number().optional(),
    sl: z.coerce.number().optional(),
    setup: z.string().min(1, 'Setup/Strategy is required'),
    notes: z.string().optional(),
    screenshot: z.string().optional(),
});

export type CreateTradeFormData = z.infer<typeof createTradeSchema>;
