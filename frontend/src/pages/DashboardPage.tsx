import { useEffect, useState } from 'react';
import { useCapitalStore } from '@/store/useCapitalStore';
import { RiskManagementWidget } from './dashboard/components/RiskWidget/RiskManagementWidget';
import { DailyCapWidget } from './dashboard/components/DailyCapWidget';
import { TradingCalendar } from './dashboard/components/TradingCalendar/TradingCalendar';
import { analyticsService, EquityPoint, AnalyticsStats } from '@/services/analytics.service';
import { EquityChart } from './analytics/components/EquityChart';
import SessionClockWidget from '@/components/SessionClockWidget';
import { PerformanceKPICards } from '@/components/PerformanceKPICards';
import { t } from 'i18next';
import { calculateDailyCapData } from './dashboard/components/RiskWidget/RiskWidgets.logic';


export default function DashboardPage() {
    const { summary, isLoading, fetchSummary } = useCapitalStore();
    const [equityData, setEquityData] = useState<EquityPoint[]>([]);
    const [analyticsStats, setAnalyticsStats] = useState<AnalyticsStats | null>(null);
    const [statsLoading, setStatsLoading] = useState(true);

    // Fetch capital summary once for the entire dashboard
    useEffect(() => {
        fetchSummary();

        // Fetch equity curve data
        const fetchEquity = async () => {
            try {
                const data = await analyticsService.getEquityCurve();
                setEquityData(data);
            } catch (err) {
                console.error("Failed to fetch equity curve for dashboard", err);
            }
        };
        fetchEquity();

        // Fetch analytics stats
        const fetchStats = async () => {
            try {
                const stats = await analyticsService.getStats();
                setAnalyticsStats(stats);
            } catch (err) {
                console.error('Failed to fetch analytics stats:', err);
            } finally {
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, [fetchSummary]);

    return (
        <div className="space-y-4 p-4 md:space-y-6 md:p-6 mb-20 md:mb-0">
            {/* Performance KPI Cards */}
            <PerformanceKPICards
                initialBalance={summary?.initialBalance || 0}
                currentEquity={summary?.currentBalance || 0}
                winRate={analyticsStats?.winRate || 0}
                profitFactor={analyticsStats?.profitFactor || 0}
                totalTrades={analyticsStats?.totalTrades || 0}
                avgLoss={analyticsStats?.averageLoss || 0}
                rrRatio={analyticsStats?.averageWin && analyticsStats?.averageLoss
                    ? Math.abs(analyticsStats.averageWin / analyticsStats.averageLoss)
                    : 0}
                totalLots={analyticsStats?.totalLots || 0}
                isLoading={isLoading || statsLoading}
            />

            {/* Page Header */}
            {/* KPI Cards - Responsive grid: 1 col mobile, 2 col tablet, 4 col desktop */}
            {/* <CapitalSummaryCards summary={summary} isLoading={isLoading} error={error} /> */}

            {/* Charts & Risk Management Row - Responsive: stack on mobile, side-by-side on desktop */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                {/* Performance Chart */}
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm lg:col-span-2 lg:p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">
                                {t('dashboard.performance')}
                            </h3>
                            <p className="text-sm text-foreground-secondary">
                                {t('dashboard.performanceDescription')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {/* Time filters usually require backend logic, keeping visual for now */}
                            <button className="rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                                ALL
                            </button>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <EquityChart
                            data={equityData}
                            simple={true}
                            showTitle={false}
                            height={256} // h-64 equivalent
                            className="bg-transparent border-none p-0"
                        />
                    </div>
                </div>

                {/* Risk Management Widgets */}
                <div className="space-y-4">
                    {/* Risk Management Widget */}
                    {summary && (
                        <RiskManagementWidget
                            currentBalance={summary.currentBalance}
                            peakBalance={summary.peakBalance || summary.currentBalance}
                            dailyProfit={summary.dailyProfit || 0}
                            dailyLossLimit={summary.dailyLossLimit || 5}
                            maxDrawdown={summary.maxDrawdown || 10}
                        />
                    )}

                    {/* Daily Cap Widget */}
                    {summary && (
                        <DailyCapWidget
                            data={calculateDailyCapData(summary.dailyProfit || 0, summary.dailyCapTarget)}
                        />
                    )}

                </div>
            </div>

            {/* Trading Calendar */}
            <TradingCalendar />

            {/* Trading Sessions Clock */}
            <SessionClockWidget />
        </div>
    );
}
