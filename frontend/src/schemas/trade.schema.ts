import { z } from 'zod';

// Helper to handle comma inputs (common on mobile/VN locale)
const preprocessNumber = (val: unknown) => {
    if (typeof val === 'string') {
        const cleaned = val.replace(/,/g, '.');
        return cleaned === '' ? undefined : cleaned;
    }
    return val;
};

const numeric = (rules?: (schema: z.ZodNumber) => z.ZodNumber) => {
    const base = z.coerce.number();
    return z.preprocess(preprocessNumber, rules ? rules(base) : base);
};

// Validation schema for creating a trade
export const createTradeSchema = z.object({
    symbol: z.string().min(1, 'Symbol is required').toUpperCase(),
    direction: z.enum(['long', 'short'], { required_error: 'Direction is required' }),
    entryDate: z.string().min(1, 'Entry date is required'),
    entryTime: z
        .string()
        .min(1, 'Entry time is required')
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    entryPrice: numeric((n) => n.positive('Entry price must be positive')),
    lotSize: numeric((n) => n.positive('Lot size must be positive')),
    exitDate: z.string().min(1, 'Exit date is required'),
    exitTime: z
        .string()
        .min(1, 'Exit time is required')
        .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:mm)'),
    exitPrice: numeric((n) => n.positive('Exit price must be positive')),
    tp: numeric((n) => n.min(0, 'TP must be positive')),
    sl: numeric((n) => n.min(0, 'SL must be positive')),
    setup: z.string().min(1, 'Setup/Strategy is required'),
    notes: z.string().optional(),
}).refine((data) => data.direction == 'long' && data.tp > data.entryPrice || data.direction == 'short' && data.tp < data.entryPrice, {
    message: 'TP phải lớn hơn giá vào lệnh đối với lệnh mua và nhỏ hơn giá vào lệnh đối với lệnh bán',
    path: ['tp'],
}).refine((data) => data.direction == 'long' && data.sl < data.entryPrice || data.direction == 'short' && data.sl > data.entryPrice, {
    message: 'SL phải nhỏ hơn giá vào lệnh đối với lệnh mua và lớn hơn giá vào lệnh đối với lệnh bán',
    path: ['sl'],
});

export type CreateTradeFormData = z.infer<typeof createTradeSchema>;
