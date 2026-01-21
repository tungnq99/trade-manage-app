import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart3, LineChart, PieChart, Layers, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { analyticsService, AnalyticsStats, EquityPoint, BreakdownItem } from '@/services/analytics.service';
import { EquityChart } from './components/EquityChart';
import { BreakdownChart } from './components/BreakdownChart';

type TabType = 'overview' | 'charts' | 'performance';

export default function AnalyticsPage() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    // State
    const [stats, setStats] = useState<AnalyticsStats | null>(null);
    const [equityData, setEquityData] = useState<EquityPoint[]>([]);
    const [symbolBreakdown, setSymbolBreakdown] = useState<BreakdownItem[]>([]);
    const [sessionBreakdown, setSessionBreakdown] = useState<BreakdownItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                setIsLoading(true);
                const [statsData, equityCurveData, symbolData, sessionData] = await Promise.all([
                    analyticsService.getStats(),
                    analyticsService.getEquityCurve(),
                    analyticsService.getSymbolBreakdown(),
                    analyticsService.getSessionBreakdown()
                ]);

                setStats(statsData);
                setEquityData(equityCurveData);
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

    const tabs = [
        { id: 'overview', label: t('analytics.tabs.overview'), icon: BarChart3 },
        { id: 'charts', label: t('analytics.tabs.charts'), icon: LineChart },
        { id: 'performance', label: t('analytics.tabs.performance'), icon: PieChart },
    ];

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

            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 border-b border-border pb-1 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2',
                                isActive
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && stats && (
                    <div className="space-y-6">
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
                    </div>
                )}

                {activeTab === 'charts' && (
                    <div className="space-y-6">
                        <EquityChart data={equityData} />
                    </div>
                )}

                {activeTab === 'performance' && (
                    <div className="space-y-6">
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
                )}
            </div>
        </div>
    );
}
