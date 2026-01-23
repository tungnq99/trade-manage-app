import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, TrendingUp, Layers } from 'lucide-react';
import { analyticsService, AnalyticsStats, BreakdownItem } from '@/services/analytics.service';
import { BreakdownChart } from './components/BreakdownChart';

export default function AnalyticsPage() {
    const { t } = useTranslation();

    // State
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [symbolBreakdown, setSymbolBreakdown] = useState<BreakdownItem[]>([]);
    const [sessionBreakdown, setSessionBreakdown] = useState<BreakdownItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setIsLoading(true);
                const [statsData, symbolData, sessionData] = await Promise.all([
                    analyticsService.getStats(),
                    analyticsService.getSymbolBreakdown(),
                    analyticsService.getSessionBreakdown()
                ]);
                setStats(statsData);
                setSymbolBreakdown(symbolData);
                setSessionBreakdown(sessionData);
            } catch (err: unknown) {
                console.error("Failed to load analytics:", err);
                const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics data';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center">{t('analytics.loading')}</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-500">{t('analytics.error')}: {error}</div>;
    }

    return (
        <div className="space-y-6 p-4 md:p-6 mb-20 md:mb-0">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">
                    {t('analytics.title')}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t('analytics.subtitle')}
                </p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Win Rate Card */}
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">{t('analytics.cards.winRate')}</h3>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold">{stats.winRate.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.winningTrades} {t('analytics.cards.wins')} / {stats.losingTrades} {t('analytics.cards.losses')}
                        </p>
                    </div>

                    {/* Profit Factor */}
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">{t('analytics.cards.profitFactor')}</h3>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold">{stats.profitFactor.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('analytics.cards.grossProfit')}: ${stats.grossProfit.toFixed(0)}
                        </p>
                    </div>

                    {/* Avg Win / Loss */}
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">{t('analytics.cards.avgWinLoss')}</h3>
                            <Layers className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-sm font-medium text-green-500">{t('analytics.cards.win')}: ${stats.averageWin.toFixed(2)}</div>
                        <div className="text-sm font-medium text-red-500">{t('analytics.cards.loss')}: ${Math.abs(stats.averageLoss).toFixed(2)}</div>
                    </div>

                    {/* Expectancy */}
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="flex flex-row items-center justify-between pb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">{t('analytics.cards.expectancy')}</h3>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-2xl font-bold">${stats.expectancy.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">
                            {t('analytics.cards.perTrade')}
                        </p>
                    </div>
                </div>
            )}

            {/* Breakdown Pie Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <BreakdownChart
                    title={t('analytics.breakdown.bySymbol')}
                    data={symbolBreakdown}
                    type="symbol"
                />
                <BreakdownChart
                    title={t('analytics.breakdown.bySession')}
                    data={sessionBreakdown}
                    type="session"
                />
            </div>
        </div>
    );
}
