import { useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { EquityPoint } from '@/services/analytics.service';

import { cn } from '@/lib/utils';

interface EquityChartProps {
    data: EquityPoint[];
    className?: string; // Container styles
    showTitle?: boolean;
    height?: number | string;
    simple?: boolean; // If true, removes border/bg/padding for embedding
}

export function EquityChart({
    data,
    className,
    showTitle = true,
    height = 320,
    simple = false
}: EquityChartProps) {
    const chartData = useMemo(() => {
        return data.map((point) => ({
            ...point,
            formattedDate: format(new Date(point.date), 'MMM dd'),
            fullDate: format(new Date(point.date), 'MMM dd, yyyy'),
        }));
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className={cn("flex w-full items-center justify-center rounded-xl border border-border bg-card", className)} style={{ height }}>
                <p className="text-muted-foreground">No equity data available</p>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "w-full",
                !simple && "rounded-xl border border-border bg-card p-4",
                className
            )}
        >
            {showTitle && <h3 className="mb-4 text-lg font-semibold">Equity Curve</h3>}
            <div style={{ height: simple ? height : (typeof height === 'number' ? height - 40 : height) }} className="w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                        <XAxis
                            dataKey="formattedDate"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            minTickGap={30}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                            domain={['auto', 'auto']}
                            width={50}
                        />
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="rounded-lg border border-border bg-background p-2 shadow-sm">
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        Date
                                                    </span>
                                                    <span className="font-bold text-muted-foreground">
                                                        {payload[0].payload.fullDate}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                        Balance
                                                    </span>
                                                    <span className="font-bold text-emerald-500">
                                                        ${payload[0].value}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorBalance)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
