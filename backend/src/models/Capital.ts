import mongoose, { Document, Schema } from 'mongoose';

export interface ICapital extends Document {
    userId: mongoose.Types.ObjectId;
    initialBalance: number;
    currency: string;
    riskPerTradePercent: number; // Default risk preference (e.g., 1%)
    dailyLossLimit: number; // Daily loss limit in % (e.g., 5%)
    maxDrawdown: number; // Max total drawdown in % (e.g., 10%)
    dailyCapTarget: number; // Daily profit target in $ (e.g., 2500)
    createdAt: Date;
    updatedAt: Date;
}

const CapitalSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        initialBalance: { type: Number, required: true, default: 0 },
        currency: { type: String, required: true, default: 'USD' },
        riskPerTradePercent: { type: Number, default: 1 },
        dailyLossLimit: { type: Number, default: 5 }, // 5% default
        maxDrawdown: { type: Number, default: 10 }, // 10% default
        dailyCapTarget: { type: Number, default: 2500 }, // $2,500 default
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ICapital>('Capital', CapitalSchema);
