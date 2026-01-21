/**
 * Risk Management Widget Constants
 */
export const SOFT_CAP_LIMIT = 85; // Soft cap at 85% drawdown
export const DAILY_CAP_TARGET = 2500; // Daily profit target in USD

/**
 * Drawdown status thresholds
 */
export const DRAWDOWN_THRESHOLDS = {
    OPTIMAL: 50,   // < 50%
    WARNING: 80    // 50-80%, > 80% = DANGER
} as const;
