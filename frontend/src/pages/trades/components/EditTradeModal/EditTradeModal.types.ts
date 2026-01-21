import { Trade } from '@/types/trade.types';

export interface EditTradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onTradeUpdated: () => void;
    trade: Trade | null;
}

// Form data type that accepts strings for number fields (before validation)
export interface EditTradeFormData {
    symbol?: string;
    direction?: 'long' | 'short';
    entryDate?: string;
    entryTime?: string;
    entryPrice?: string | number;
    lotSize?: string | number;
    exitDate?: string;
    exitTime?: string;
    exitPrice?: string | number;
    tp?: string | number;
    sl?: string | number;
    setup?: string;
    notes?: string;
}
