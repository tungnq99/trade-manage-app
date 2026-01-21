import { apiClient } from '@/lib/api';

export interface AnalyticsStats {
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    breakEvenTrades: number;
    totalNetProfit: number;
    grossProfit: number;
    grossLoss: number;
    winRate: number;
    profitFactor: number;
    averageWin: number;
    averageLoss: number;
    expectancy: number;
    totalLots: number;
}

export interface EquityPoint {
    date: string;
    balance: number;
    dailyProfit: number;
    trades: number;
}

export interface BreakdownItem {
    symbol?: string;
    session?: string;
    totalTrades: number;
    totalPnl: number;
    winRate: number;
}

export const analyticsService = {
    getStats: async (): Promise<AnalyticsStats> => {
        const response = await apiClient.get('/api/analytics/stats');
        return response.data;
    },

    getEquityCurve: async (): Promise<EquityPoint[]> => {
        const response = await apiClient.get('/api/analytics/equity-curve');
        return response.data;
    },

    getSymbolBreakdown: async (): Promise<BreakdownItem[]> => {
        const response = await apiClient.get('/api/analytics/breakdown-by-symbol');
        return response.data;
    },

    getSessionBreakdown: async (): Promise<BreakdownItem[]> => {
        const response = await apiClient.get('/api/analytics/breakdown-by-session');
        return response.data;
    }
};
