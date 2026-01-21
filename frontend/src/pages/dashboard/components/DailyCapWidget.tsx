import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { DailyCapData } from './RiskWidget/RiskWidgets.types';

interface DailyCapWidgetProps {
    data: DailyCapData;
}

export const DailyCapWidget = ({ data }: DailyCapWidgetProps) => {
    const { t } = useTranslation();
    const { dailyTarget, dailyProfit, progressPercent } = data;

    const isPositive = dailyProfit >= 0;
    const displayPercent = Math.min(progressPercent, 100);

    return (
        <div className="rounded-2xl border border-border bg-card p-4 md:p-6 shadow-sm">
            {/* Header */}
            <h3 className="text-base font-semibold text-foreground mb-4">
                {t('dashboard.dailyCap.title')}
            </h3>

            {/* Circular Progress */}
            <div className="flex items-center gap-4">
                {/* SVG Circle Progress */}
                <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-muted"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 32}`}
                            strokeDashoffset={`${2 * Math.PI * 32 * (1 - displayPercent / 100)}`}
                            className={cn(
                                'transition-all duration-500',
                                isPositive ? 'text-blue-500' : 'text-muted'
                            )}
                            strokeLinecap="round"
                        />
                    </svg>
                    {/* Center percentage */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-foreground">
                            {displayPercent.toFixed(0)}%
                        </span>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                        {t('dashboard.dailyCap.target')}: ${dailyTarget.toFixed(2)}
                    </div>
                    <div className={cn(
                        'text-xl font-bold',
                        isPositive ? 'text-success' : 'text-destructive'
                    )}>
                        {isPositive ? '+' : ''}${Math.abs(dailyProfit).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    );
};
