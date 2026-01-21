import mongoose, { Schema, Document } from 'mongoose';

export interface IEconomicEvent extends Document {
    date: Date;
    currency: string;
    event: string;
    impact: 'High' | 'Medium' | 'Low';
    forecast?: string;
    previous?: string;
    actual?: string;
    source: string;
    lastUpdated: Date;
    createdAt: Date;
}

const EconomicEventSchema: Schema = new Schema({
    date: {
        type: Date,
        required: true,
        index: true
    },
    currency: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD']
    },
    event: {
        type: String,
        required: true
    },
    impact: {
        type: String,
        required: true,
        enum: ['High', 'Medium', 'Low']
    },
    forecast: {
        type: String,
        default: null
    },
    previous: {
        type: String,
        default: null
    },
    actual: {
        type: String,
        default: null
    },
    source: {
        type: String,
        required: true,
        default: 'manual'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound indexes for efficient queries
EconomicEventSchema.index({ date: 1, impact: 1 });
EconomicEventSchema.index({ currency: 1, date: 1 });
EconomicEventSchema.index({ date: 1, currency: 1, event: 1 }, { unique: true }); // Prevent duplicates

export default mongoose.model<IEconomicEvent>('EconomicEvent', EconomicEventSchema);
