import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
    label: string;
    value: string | number;
    change?: {
        value: string;
        positive?: boolean;
    };
    icon?: LucideIcon;
    badge?: string;
    className?: string;
}

/**
 * KPI Card - Stat card với glassmorphism effect
 * Dùng cho Dashboard metrics
 */
export function KPICard({
    label,
    value,
    change,
    icon: Icon,
    badge,
    className,
}: KPICardProps) {
    return (
        <div
            className={cn(
                'glass-card p-6 transition-all hover:bg-background-secondary/70',
                className
            )}
        >
            {/* Header: Icon/Label + Badge */}
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {Icon && (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                        </div>
                    )}
                    <span className="text-xs font-medium uppercase tracking-wider text-foreground-secondary">
                        {label}
                    </span>
                </div>

                {badge && (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground-secondary">
                        {badge}
                    </span>
                )}
            </div>

            {/* Value */}
            <div className="text-3xl font-bold text-foreground">{value}</div>

            {/* Change indicator */}
            {change && (
                <div
                    className={cn(
                        'mt-2 text-sm font-medium',
                        change.positive === false ? 'text-destructive' : 'text-success'
                    )}
                >
                    {change.positive !== false && '↑'} {change.positive === false && '↓'}{' '}
                    {change.value}
                </div>
            )}
        </div>
    );
}
