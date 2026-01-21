export interface RiskStatus {
    currentDrawdown: number;
    softCapLimit: number;
    status: 'optimal' | 'warning' | 'danger';
    peakBalance: number;
    currentBalance: number;
}

export interface DailyCapData {
    dailyTarget: number;
    dailyProfit: number;
    progressPercent: number;
    remaining: number;
}
