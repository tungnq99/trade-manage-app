export interface CalendarDay {
    date: string;
    dayOfMonth: string;
    profit: number;
    volume: number;
    tradeCount: number;
    hasTrading: boolean;
}

export interface CalendarSummary {
    totalProfit: number;
    totalVolume: number;
    totalTrades: number;
    profitableDays: number;
    totalDays: number;
}

export interface CalendarData {
    month: string;
    summary: CalendarSummary;
    days: CalendarDay[];
}
