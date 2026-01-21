// Trade-related types
export interface Trade {
    _id: string;
    userId: string;
    symbol: string;
    direction: 'long' | 'short';
    entryDate: string;
    entryTime: string;
    entryPrice: number;
    lotSize: number;
    exitDate: string;
    exitTime: string;
    exitPrice: number;
    tp?: number;
    sl?: number;
    pips: number;
    profitLoss: number;
    profitLossPercent: number;
    setup: string;
    notes?: string;
    screenshot?: string;
    session: 'asian' | 'london' | 'newyork';
    importSource: 'manual' | 'csv';
    createdAt: string;
    updatedAt: string;
}

export interface CreateTradeDto {
    symbol: string;
    direction: 'long' | 'short';
    entryDate: string;
    entryTime: string;
    entryPrice: number;
    lotSize: number;
    exitDate: string;
    exitTime: string;
    exitPrice: number;
    setup: string;
    notes?: string;
    screenshot?: string;
    session: 'asian' | 'london' | 'newyork';
    tp?: number;
    sl?: number;
    pips: number;
    profitLoss: number;
    profitLossPercent: number;
}

export interface TradeFilters {
    symbol?: string;
    direction?: 'long' | 'short';
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}

export interface TradeListResponse {
    success: boolean;
    trades: Trade[];
    pagination: {
        total: number;
        page: number;
        pages: number;
    };
}
