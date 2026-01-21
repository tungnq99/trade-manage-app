export interface CapitalSettings {
    initialBalance: number;
    currency: string;
    riskPerTradePercent: number;
}

export interface CapitalSummary {
    initialBalance: number;
    currentBalance: number;
    totalProfit: number;
    totalTrades: number;
    currency: string;
    riskPerTradePercent: number;
    dailyLossLimit: number;
    maxDrawdown: number;
    dailyCapTarget: number;
    peakBalance: number;
    dailyProfit: number;
    isOnboardingRequired: boolean;
}

export interface UpdateCapitalDto {
    initialBalance: number;
    currency?: string;
    riskPerTradePercent?: number;
    dailyLossLimit?: number;
    maxDrawdown?: number;
    dailyCapTarget?: number;
}
