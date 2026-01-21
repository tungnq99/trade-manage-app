import mongoose, { Document, Schema } from 'mongoose';

export interface ITrade extends Document {
    userId: mongoose.Types.ObjectId;
    symbol: string;
    direction: 'long' | 'short';
    entryDate: Date;
    entryTime: string; // HH:mm
    entryPrice: number;
    lotSize: number;
    exitDate: Date;
    exitTime: string; // HH:mm
    exitPrice: number;
    tp?: number;
    sl?: number;
    pips: number;
    profitLoss: number;
    profitLossPercent: number;
    setup: string;
    notes?: string;
    screenshot?: string;
    session: 'asian' | 'london' | 'newyork' | 'overlap';
    importSource: 'manual' | 'csv';
    createdAt: Date;
    updatedAt: Date;
}

const TradeSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        symbol: { type: String, required: true, trim: true, uppercase: true },
        direction: { type: String, enum: ['long', 'short'], required: true },
        entryDate: { type: Date, required: true },
        entryTime: { type: String, required: true }, // Validation regex can be added in controller or here
        entryPrice: { type: Number, required: true },
        lotSize: { type: Number, required: true },
        exitDate: { type: Date, required: true },
        exitTime: { type: String, required: true },
        exitPrice: { type: Number, required: true },
        tp: { type: Number }, // Optional Take Profit
        sl: { type: Number }, // Optional Stop Loss
        pips: { type: Number, required: true },
        profitLoss: { type: Number, required: true },
        profitLossPercent: { type: Number, required: true },
        setup: { type: String, required: true, trim: true },
        notes: { type: String, trim: true },
        screenshot: { type: String, trim: true },
        session: {
            type: String,
            enum: ['asian', 'london', 'newyork', 'overlap'],
            required: true,
        },
        importSource: {
            type: String,
            enum: ['manual', 'csv'],
            default: 'manual',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for common queries
TradeSchema.index({ userId: 1, entryDate: -1 }); // Default sort: My trades by date desc
TradeSchema.index({ userId: 1, symbol: 1 }); // Filter by symbol
TradeSchema.index({ userId: 1, direction: 1 }); // Filter by direction
// Compound index for duplicate detection (especially for CSV import)
TradeSchema.index(
    { userId: 1, symbol: 1, entryDate: 1, entryTime: 1, entryPrice: 1 },
    { unique: true }
);

export default mongoose.model<ITrade>('Trade', TradeSchema);
