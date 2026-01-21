import { Trade, DayData, CalendarSummary } from './TradingCalendar.types';
import { WEEK_DAYS_KEYS, DAYS_IN_WEEK } from '@/constants/calendar';
import { formatDateKey, getMonthBoundaries } from '@/utils/date';

/**
 * Constants (Component-specific)
 */
export { WEEK_DAYS_KEYS, DAYS_IN_WEEK }; // Re-export for convenience
export const TRADES_LIMIT_PER_MONTH = 500;
export const SKELETON_CELLS_COUNT = 35;

/**
 * Re-export utils for convenience
 */
export { getMonthBoundaries, formatDateKey };

/**
 * Group trades by day
 */
export function groupTradesByDay(trades: Trade[]): Map<string, {
    profit: number;
    percent: number;
    symbol: string;
    lotSize: number;
    count: number;
}> {
    const dayMap = new Map();

    trades.forEach(trade => {
        const tradeDate = new Date(trade.entryDate);
        const dateKey = formatDateKey(tradeDate);

        const existing = dayMap.get(dateKey) || {
            profit: 0,
            percent: 0,
            symbol: '',
            lotSize: 0,
            count: 0
        };

        dayMap.set(dateKey, {
            profit: existing.profit + trade.profitLoss,
            percent: existing.percent + trade.profitLossPercent,
            symbol: existing.symbol + trade.symbol,
            lotSize: existing.lotSize + trade.lotSize,
            count: existing.count + 1
        });
    });

    return dayMap;
}

/**
 * Generate calendar days for a month
 */
export function generateCalendarDays(
    year: number,
    month: number,
    dayMap: Map<string, any>
): DayData[] {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarDays: DayData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = dayMap.get(dateKey);

        calendarDays.push({
            date: dateKey,
            dayOfMonth: day,
            profit: dayData?.profit || 0,
            percent: dayData?.percent || 0,
            lotSize: dayData?.lotSize || 0,
            tradeCount: dayData?.count || 0,
            hasTrading: !!dayData
        });
    }

    return calendarDays;
}

/**
 * Build calendar grid with proper week alignment
 */
export function buildCalendarGrid(
    year: number,
    month: number,
    days: DayData[]
): (DayData | null)[] {
    // Calculate first day offset (Monday = 0)
    const firstDayOfMonth = new Date(year, month, 1);
    let firstDayOffset = firstDayOfMonth.getDay() - 1;
    if (firstDayOffset < 0) firstDayOffset = 6; // Sunday becomes 6

    // Build grid
    const calendarGrid: (DayData | null)[] = Array(firstDayOffset).fill(null);
    calendarGrid.push(...days);

    // Pad to complete last week
    while (calendarGrid.length % DAYS_IN_WEEK !== 0) {
        calendarGrid.push(null);
    }

    return calendarGrid;
}

/**
 * Calculate summary statistics
 */
export function calculateSummary(days: DayData[]): CalendarSummary {
    return {
        totalProfit: days.reduce((sum, day) => sum + day.profit, 0),
        totalPercent: days.reduce((sum, day) => sum + day.percent, 0),
        totalLotSize: days.reduce((sum, day) => sum + day.lotSize, 0),
        totalTrades: days.reduce((sum, day) => sum + day.tradeCount, 0),
        profitableDays: days.filter(d => d.hasTrading && d.profit > 0).length,
        tradingDays: days.filter(d => d.hasTrading).length
    };
}
