import { create } from 'zustand';
import { apiClient } from '@/lib/api';

interface Trade {
    _id: string;
    entryDate: string;
    profitLoss: number;
    profitLossPercent: number;
    lotSize: number;
    symbol: string;
    direction: 'long' | 'short';
    pips: number;
}

interface TradesState {
    trades: Trade[];
    isLoading: boolean;
    error: string | null;
    
    // Actions
    fetchTrades: (params?: FetchTradesParams) => Promise<void>;
    clearTrades: () => void;
}

interface FetchTradesParams {
    startDate?: string;
    endDate?: string;
    symbol?: string;
    direction?: string;
    limit?: number;
    page?: number;
}

export const useTradesStore = create<TradesState>((set) => ({
    trades: [],
    isLoading: false,
    error: null,

    fetchTrades: async (params = {}) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get('/api/trades', { params });
            set({ 
                trades: response.data.trades || [],
                isLoading: false 
            });
        } catch (error: any) {
            set({ 
                error: error.response?.data?.message || 'Failed to fetch trades',
                isLoading: false 
            });
            console.error('Failed to fetch trades:', error);
        }
    },

    clearTrades: () => set({ trades: [], error: null }),
}));
