/**
 * Trading Constants - Business domain specific constants
 * Chứa các cặp tiền tệ phổ biến và trading-related constants
 */

export const COMMON_PAIRS = [
    'EURUSD',
    'GBPUSD',
    'USDJPY',
    'USDCHF',
    'AUDUSD',
    'USDCAD',
    'NZDUSD',
    'EURGBP',
    'EURJPY',
    'GBPJPY',
    'XAUUSD',
    'BTCUSD',
] as const;

export type TradingSymbol = typeof COMMON_PAIRS[number];

/**
 * Standard pip value per lot cho major pairs
 */
export const STANDARD_PIP_VALUE = 10;

/**
 * Pip size calculation
 */
export const getPipSize = (symbol: string): number => {
    return symbol.includes('XAU') ? 0.1 : symbol.includes('JPY') ? 0.01 : 0.0001;
};
