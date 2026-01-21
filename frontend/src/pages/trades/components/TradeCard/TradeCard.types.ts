import { Trade } from '@/types/trade.types';

export interface TradeCardProps {
    trade: Trade;
    onEdit: (trade: Trade) => void;
    onDelete: (trade: Trade) => void;
    onClick: (trade: Trade) => void;
}
