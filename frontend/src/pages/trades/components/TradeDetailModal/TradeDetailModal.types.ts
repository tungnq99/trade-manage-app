import { Trade } from '@/types/trade.types';

export interface TradeDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (trade: Trade) => void;
    trade: Trade | null;
}
