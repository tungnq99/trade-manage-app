import { TrendingUp, TrendingDown, DollarSign, Target, BarChart3, AlertCircle, Scale, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PerformanceKPICardsProps {
    initialBalance: number;
    currentEquity: number;
    winRate: number;
    profitFactor: number;
    totalTrades: number;
    avgLoss: number;
    rrRatio: number;
    totalLots: number;
    isLoading?: boolean;
}

interface KPICardData {
    label: string;
    value: string | number;
    subValue?: string;
    icon: React.ReactNode;
    colorClass?: string;
    trend?: 'up' | 'down' | 'neutral';
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
};

const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
};

export function PerformanceKPICards({
    initialBalance,
    currentEquity,
    winRate,
    profitFactor,
    totalTrades,
    avgLoss,
    rrRatio,
    totalLots,
    isLoading = false
}: PerformanceKPICardsProps) {

    // Calculate equity change
    const equityChange = currentEquity - initialBalance;
    const equityChangePercent = ((equityChange / initialBalance) * 100);


    const cards: KPICardData[] = [
        {
            label: 'Vốn sở hữu',
            value: formatCurrency(initialBalance),
            icon: <DollarSign className="h-4 w-4" />,
            colorClass: 'text-primary'
        },
        {
            label: 'Số dư tài khoản',
            value: formatCurrency(currentEquity),
            subValue: `${equityChange >= 0 ? '+' : ''}${formatCurrency(equityChange)} (${equityChangePercent >= 0 ? '+' : ''}${equityChangePercent.toFixed(1)}%)`,
            icon: <TrendingUp className="h-4 w-4" />,
            colorClass: equityChange >= 0 ? 'text-success' : 'text-destructive',
            trend: equityChange >= 0 ? 'up' : 'down'
        },
        {
            label: 'Win Rate',
            value: formatPercent(winRate),
            icon: <Target className="h-4 w-4" />,
            colorClass: 'text-primary'
        },
        {
            label: 'Profit Factor',
            value: profitFactor.toFixed(2),
            icon: <TrendingUp className="h-4 w-4" />,
            colorClass: 'text-primary'
        },
        {
            label: 'Số lệnh',
            value: totalTrades,
            icon: <BarChart3 className="h-4 w-4" />,
            colorClass: 'text-primary'
        },
        {
            label: 'Khoản lỗ trung bình',
            value: formatCurrency(avgLoss),
            icon: <AlertCircle className="h-4 w-4" />,
            colorClass: 'text-destructive'
        },
        {
            label: 'RR Ratio',
            value: rrRatio.toFixed(2),
            icon: <Scale className="h-4 w-4" />,
            colorClass: 'text-primary'
        },
        {
            label: 'Số lot',
            value: totalLots.toFixed(2),
            icon: <Package className="h-4 w-4" />,
            colorClass: 'text-primary'
        }
    ];

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
                        <div className="h-4 bg-muted rounded w-20 mb-2"></div>
                        <div className="h-7 bg-muted rounded w-24"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="rounded-xl border border-border bg-card p-3 md:p-4 hover:bg-accent/50 transition-colors"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-muted-foreground">{card.label}</span>
                        <div className={cn('opacity-70', card.colorClass)}>
                            {card.icon}
                        </div>
                    </div>

                    {/* Main Value */}
                    <div className={cn('text-xl md:text-2xl font-bold', card.colorClass)}>
                        {card.value}
                    </div>

                    {/* Sub Value (if exists) */}
                    {card.subValue && (
                        <div className={cn('text-xs mt-1 flex items-center gap-1', card.colorClass)}>
                            {card.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                            {card.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                            <span>{card.subValue}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
