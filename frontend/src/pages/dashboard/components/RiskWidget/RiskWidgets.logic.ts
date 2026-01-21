
import { DRAWDOWN_THRESHOLDS, DAILY_CAP_TARGET } from '@/constants/risk';
import { DailyCapData } from './RiskWidgets.types';

/**
 * Calculate drawdown percentage
 */
export function calculateDrawdown(peakBalance: number, currentBalance: number): number {
    if (peakBalance === 0) return 0;
    return ((peakBalance - currentBalance) / peakBalance) * 100;
}

/**
 * Determine risk status based on drawdown
 */
export function getRiskStatus(drawdownPercent: number): 'optimal' | 'warning' | 'danger' {
    if (drawdownPercent < DRAWDOWN_THRESHOLDS.OPTIMAL) return 'optimal';
    if (drawdownPercent < DRAWDOWN_THRESHOLDS.WARNING) return 'warning';
    return 'danger';
}

/**
 * Calculate daily loss limit data
 */
export function calculateDailyLossData(
    dailyProfit: number,
    currentBalance: number,
    dailyLossLimitPercent: number
): {
    percentMax: number;
    percentUsed: number;
    amountUsed: number;
    amountMax: number;
    amountRemaining: number;
    status: 'safe' | 'warning' | 'danger';
} {
    // Validate inputs
    const validBalance = currentBalance || 0;
    const validPercent = dailyLossLimitPercent || 5;
    const validProfit = dailyProfit || 0;

    const amountMax = (validBalance * validPercent) / 100;
    const amountUsed = validProfit < 0 ? Math.abs(validProfit) : 0;
    const percentUsed = amountMax > 0 ? (amountUsed / amountMax) * 100 : 0;
    const amountRemaining = Math.max(amountMax - amountUsed, 0);

    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (percentUsed >= 80) status = 'danger';
    else if (percentUsed >= 50) status = 'warning';

    return {
        percentMax: validPercent,
        percentUsed: Math.min(percentUsed, 100),
        amountUsed,
        amountMax,
        amountRemaining,
        status
    };
}

/**
 * Calculate max total drawdown data
 */
export function calculateMaxDrawdownData(
    peakBalance: number,
    currentBalance: number,
    maxDrawdownPercent: number
): {
    percentMax: number;
    percentUsed: number;
    amountUsed: number;
    amountMax: number;
    amountRemaining: number;
    status: 'safe' | 'warning' | 'danger';
} {
    // Validate inputs
    const validPeak = peakBalance || 0;
    const validCurrent = currentBalance || 0;
    const validPercent = maxDrawdownPercent || 10;

    const drawdownAmount = Math.max(validPeak - validCurrent, 0);
    const amountMax = (validPeak * validPercent) / 100;
    const percentUsed = amountMax > 0 ? (drawdownAmount / amountMax) * 100 : 0;
    const amountRemaining = Math.max(amountMax - drawdownAmount, 0);

    let status: 'safe' | 'warning' | 'danger' = 'safe';
    if (percentUsed >= 80) status = 'danger';
    else if (percentUsed >= 50) status = 'warning';

    return {
        percentMax: validPercent,
        percentUsed: Math.min(percentUsed, 100),
        amountUsed: drawdownAmount,
        amountMax,
        amountRemaining,
        status
    };
}

/**
 * Get progress bar color based on status
 */
export function getDrawdownColor(status: 'safe' | 'warning' | 'danger'): string {
    const colors = {
        safe: 'bg-success',
        warning: 'bg-yellow-500',
        danger: 'bg-destructive'
    };
    return colors[status];
}

/**
 * Calculate daily cap progress (for Daily Cap Widget)
 */
export function calculateDailyCapData(dailyProfit: number, dailyTarget?: number): DailyCapData {
    const target = dailyTarget || DAILY_CAP_TARGET;
    const progressPercent = (dailyProfit / target) * 100;
    const remaining = target - dailyProfit;

    return {
        dailyTarget: target,
        dailyProfit,
        progressPercent: Math.min(progressPercent, 100), // Cap at 100%
        remaining: Math.max(remaining, 0) // Don't show negative
    };
}

/**
 * Get status badge color (legacy - kept for compatibility)
 */
export function getStatusBadgeColor(status: 'optimal' | 'warning' | 'danger'): string {
    const colors = {
        optimal: 'bg-success/20 text-success',
        warning: 'bg-yellow-500/20 text-yellow-500',
        danger: 'bg-destructive/20 text-destructive'
    };
    return colors[status];
}
