import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { tradeService } from '@/services/trade.service';
import {
    groupTradesByDay,
    generateCalendarDays,
    buildCalendarGrid,
    calculateSummary,
    getMonthBoundaries,
    WEEK_DAYS_KEYS,
    TRADES_LIMIT_PER_MONTH,
    SKELETON_CELLS_COUNT
} from './TradingCalendar.logic';
import { DayData } from './TradingCalendar.types';

export const TradingCalendar = () => {
    const { t } = useTranslation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [days, setDays] = useState<DayData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        fetchCalendarData();
    }, [year, month]);

    const fetchCalendarData = async () => {
        setIsLoading(true);
        try {
            const { startDate, endDate } = getMonthBoundaries(year, month);

            // ✅ Service Layer - Anti-Corruption Pattern
            const response = await tradeService.getTrades({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                limit: TRADES_LIMIT_PER_MONTH
            });

            const trades = response.trades || [];
            const dayMap = groupTradesByDay(trades);
            const calendarDays = generateCalendarDays(year, month, dayMap);

            setDays(calendarDays);
        } catch (error) {
            console.error('Failed to fetch calendar data:', error);
            // Generate empty calendar on error
            const dayMap = new Map();
            const calendarDays = generateCalendarDays(year, month, dayMap);
            setDays(calendarDays);
        } finally {
            setIsLoading(false);
        }
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prev => direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1));
    };

    const calendarGrid = buildCalendarGrid(year, month, days);
    const summary = calculateSummary(days);

    const getDayCellStyles = (day: DayData | null) => {
        if (!day) return 'border-transparent bg-background-tertiary/5';

        if (!day.hasTrading) {
            return 'cursor-pointer border-border/30 bg-background-tertiary/10 hover:bg-background-tertiary/20';
        }

        return cn(
            'border-border bg-background-secondary/30 cursor-pointer',
            day.profit > 0 && 'border-emerald-500/50 hover:bg-emerald-500/10',
            day.profit < 0 && 'border-red-500/50 hover:bg-red-500/10',
            day.profit === 0 && 'hover:bg-background-secondary hover:border-background-secondary'
        );
    };

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-border bg-card p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-1/3" />
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: SKELETON_CELLS_COUNT }).map((_, i) => (
                            <div key={i} className="h-20 bg-muted rounded" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-4 md:p-6 shadow-sm">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                    {t('calendar.title')}
                </h3>
            </div>

            {/* Month Navigation */}
            <div className="mb-4 flex items-center justify-center gap-4">
                <button
                    onClick={() => navigateMonth('prev')}
                    className="rounded-lg p-2 transition-colors hover:bg-muted"
                    aria-label={t('calendar.navigation.previousMonth')}
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <span className="min-w-[180px] text-center text-sm font-medium text-success">
                    {(t('calendar.monthNames', { returnObjects: true }) as string[])[month]} {year}
                </span>
                <button
                    onClick={() => navigateMonth('next')}
                    className="rounded-lg p-2 transition-colors hover:bg-muted"
                    aria-label={t('calendar.navigation.nextMonth')}
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>

            {/* Summary Cards */}
            <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-background-secondary/50 p-3 text-center">
                    <div className="mb-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <span>{t('calendar.summary.totalProfit')}</span>
                    </div>
                    <div className={cn(
                        'text-xl font-bold',
                        summary.totalProfit >= 0 ? 'text-success' : 'text-destructive'
                    )}>
                        ${summary.totalProfit.toFixed(2)}
                    </div>
                    <div className={cn(
                        'text-xs',
                        summary.totalPercent >= 0 ? 'text-success' : 'text-destructive'
                    )}>
                        {summary.totalProfit > 0 ? '+' : '-'} {summary.totalPercent.toFixed(2)}%
                    </div>
                </div>
                <div className="rounded-lg bg-background-secondary/50 p-3 text-center">
                    <div className="mb-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <span>{t('calendar.summary.totalVolume')}</span>
                    </div>
                    <div className="text-xl font-bold text-destructive">
                        {summary.totalLotSize.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-2">
                {/* Week days header */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-muted-foreground pb-2 border-b border-border/50">
                    {WEEK_DAYS_KEYS.map((dayKey) => (
                        <div key={dayKey} className="py-1.5">{t(dayKey)}</div>
                    ))}
                </div>

                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarGrid.map((day, index) => (
                        <div
                            key={index}
                            className={cn(
                                'relative min-h-[80px] md:min-h-[90px] rounded-lg border p-1.5 transition-all',
                                getDayCellStyles(day)
                            )}
                        >
                            {day && (
                                <div className="flex h-full flex-col">
                                    {/* Day number */}
                                    <div className="text-[10px] font-medium text-muted-foreground mb-1">
                                        {day.dayOfMonth}
                                    </div>

                                    {/* Trading data */}
                                    {day.hasTrading && (
                                        <div className="flex flex-col items-center justify-center flex-1 gap-0.5">
                                            <div className={cn(
                                                'text-[10px] md:text-sm font-bold',
                                                day.profit >= 0 ? 'text-success' : 'text-destructive'
                                            )}>
                                                {day.profit >= 0 ? '+' : ''}${day.profit.toFixed(2)}
                                            </div>
                                            <div className={cn(
                                                'text-[9px] md:text-[10px]',
                                                day.percent >= 0 ? 'text-success' : 'text-destructive'
                                            )}>
                                                {day.percent >= 0 ? '+' : ''}{day.percent.toFixed(2)}%
                                            </div>
                                            <div className="text-[8px] text-muted-foreground/70 mt-0.5">
                                                {day.tradeCount} {t('calendar.stats.orders')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                <span>{summary.totalTrades} {t('calendar.stats.trades')}</span>
                <span>
                    {summary.profitableDays}/{summary.tradingDays} {t('calendar.stats.profitableDays')}
                </span>
            </div>
        </div>
    );
};
