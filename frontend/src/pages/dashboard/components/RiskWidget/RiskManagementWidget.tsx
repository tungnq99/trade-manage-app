import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { TrendingDown } from 'lucide-react';
import { calculateDailyLossData, calculateMaxDrawdownData, getDrawdownColor } from './RiskWidgets.logic';

interface RiskManagementWidgetProps {
    currentBalance: number;
    peakBalance: number;
    dailyProfit: number;
    dailyLossLimit: number;    // % (e.g., 5)
    maxDrawdown: number;        // % (e.g., 10)
}

export const RiskManagementWidget = ({
    currentBalance,
    peakBalance,
    dailyProfit,
    dailyLossLimit,
    maxDrawdown
}: RiskManagementWidgetProps) => {
    const { t } = useTranslation();

    const dailyLossData = calculateDailyLossData(dailyProfit, currentBalance, dailyLossLimit);
    const maxDrawdownData = calculateMaxDrawdownData(peakBalance, currentBalance, maxDrawdown);

    const renderMetric = (
        title: string,
        data: ReturnType<typeof calculateDailyLossData>
    ) => (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                    {title} ({data.percentMax}%)
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                    className={cn(
                        'h-full transition-all duration-300',
                        getDrawdownColor(data.status)
                    )}
                    style={{ width: `${data.percentUsed}%` }}
                />
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                    {data.percentUsed.toFixed(1)}% used (${data.amountUsed.toFixed(0)}/${data.amountMax.toFixed(0)})
                </span>
                <span className={cn(
                    'font-medium',
                    data.status === 'safe' && 'text-success',
                    data.status === 'warning' && 'text-yellow-500',
                    data.status === 'danger' && 'text-destructive'
                )}>
                    {data.status === 'safe' && '✅'}
                    {data.status === 'warning' && '⚠️'}
                    {data.status === 'danger' && '🚨'}
                    {' '}- ${data.amountRemaining.toFixed(0)}
                </span>
            </div>
        </div>
    );

    return (
        <div className="rounded-2xl border border-border bg-card p-4 md:p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">
                    {t('dashboard.riskManagement.title')}
                </h3>
            </div>

            {/* Metrics */}
            <div className="space-y-4">
                {renderMetric(t('dashboard.riskManagement.dailyLoss'), dailyLossData)}
                {renderMetric(t('dashboard.riskManagement.maxLoss'), maxDrawdownData)}
            </div>
        </div>
    );
};
