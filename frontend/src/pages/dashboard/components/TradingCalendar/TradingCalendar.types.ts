// Types
export interface Trade {
    _id: string;
    entryDate: string;
    profitLoss: number;
    profitLossPercent: number;
    lotSize: number;
    symbol: string;
}

export interface DayData {
    date: string;
    dayOfMonth: number;
    profit: number;
    lotSize: number;
    percent: number;
    tradeCount: number;
    hasTrading: boolean;
}

export interface CalendarSummary {
    totalProfit: number;
    totalPercent: number;
    totalLotSize: number;
    totalTrades: number;
    profitableDays: number;
    tradingDays: number;
}
