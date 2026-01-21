import { useNavigate } from 'react-router-dom';
import { Wallet, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { KPICard } from '@/components/ui/kpi-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CapitalSummary } from '@/types/capital.types';
import { cn } from '@/lib/utils';

interface CapitalSummaryCardsProps {
    summary: CapitalSummary | null;
    isLoading: boolean;
    error: any;
}

export const CapitalSummaryCards = ({ summary, isLoading, error }: CapitalSummaryCardsProps) => {
    const navigate = useNavigate();
    // No fetch here - parent DashboardPage handles it

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 animate-pulse rounded-xl bg-muted/50" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-6">
                <p className="text-center text-sm text-destructive">
                    Error fetching capital summary: {error.message || 'Unknown error'}
                </p>
            </div>
        );
    }

    // Require Setup
    if (!summary || summary.isOnboardingRequired) {
        return (
            <Card className="border-dashed border-primary/50 bg-primary/5">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <h3 className="mb-2 text-lg font-semibold">Account Setup Required</h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Please set up your initial capital to start tracking performance.
                    </p>
                    <Button onClick={() => navigate('/onboarding/capital')}>
                        Setup Capital
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const { initialBalance, currentBalance, totalProfit } = summary;
    const isProfit = totalProfit >= 0;
    const profitPercent = initialBalance > 0
        ? ((totalProfit / initialBalance) * 100).toFixed(2)
        : '0.00';

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Starting Capital */}
            <KPICard
                label="Starting Capital"
                value={`$${initialBalance.toLocaleString()}`}
                icon={Wallet}
                className="border-l-4 border-l-blue-500"
            />

            {/* 2. Current Equity */}
            <KPICard
                label="Current Equity"
                value={`$${currentBalance.toLocaleString()}`}
                icon={DollarSign}
                className={cn(
                    'border-l-4',
                    isProfit ? 'border-l-green-500' : 'border-l-red-500'
                )}
                change={{
                    value: isProfit ? 'Profit' : 'Loss',
                    positive: isProfit
                }}
            />

            {/* 3. Net P/L */}
            <KPICard
                label="Net P/L"
                value={`${isProfit ? '+' : ''}$${totalProfit.toLocaleString()}`}
                icon={isProfit ? TrendingUp : TrendingDown}
                badge={`${isProfit ? '+' : ''}${profitPercent}%`}
                className={cn(
                    isProfit ? 'bg-green-500/5' : 'bg-red-500/5'
                )}
                change={{
                    value: `${profitPercent}%`,
                    positive: isProfit
                }}
            />
        </div>
    );
};
