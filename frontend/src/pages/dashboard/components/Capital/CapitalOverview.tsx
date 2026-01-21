import { KPICard } from '@/components/ui/kpi-card';
import { DollarSign, TrendingUp, Trophy, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const CapitalOverview = ({ summary, isLoading, error }: { summary: any; isLoading: boolean; error: any }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    // No fetch here - parent DashboardPage handles it

    if (isLoading && !summary) {
        return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
        </div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">Error loading capital data: {error}</div>;
    }

    if (!summary) {
        return null;
    }

    if (summary.isOnboardingRequired) {
        return (
            <div className="rounded-2xl border border-border bg-card p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Setup Your Capital</h3>
                <p className="text-muted-foreground mb-4">Please set your initial capital to start tracking performance.</p>
                <Button onClick={() => navigate('/onboarding/capital')}>Get Started</Button>
            </div>
        );
    }

    const plSign = summary.totalProfit >= 0 ? '+' : '';

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KPICard
                label="Current Balance"
                value={`$${summary.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                icon={DollarSign}
                badge="LIVE"
            />

            <KPICard
                label="Initial Capital"
                value={`$${summary.initialBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                icon={TrendingUp}
                className="opacity-80"
            />

            <KPICard
                label={t('dashboard.overview.totalPL')}
                value={`${plSign}$${Math.abs(summary.totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                icon={Trophy}
                className={summary.totalProfit >= 0 ? "border-success/20 bg-success/5" : "border-destructive/20 bg-destructive/5"}
            />

            <KPICard
                label={t('dashboard.overview.totalTrades')}
                value={summary.totalTrades}
                icon={Activity}
            />
        </div>
    );
};
