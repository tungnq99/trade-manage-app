import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip } from 'recharts';
import { BreakdownItem } from '@/services/analytics.service';
import { useThemeStore } from '@/store/themeStore';

interface BreakdownChartProps {
    title: string;
    data: BreakdownItem[];
    type: 'symbol' | 'session';
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;

    return (
        <g>
            <text x={cx} y={cy} dy={-4} textAnchor="middle" fill={fill} className="text-sm font-bold">
                {payload.name}
            </text>
            <text x={cx} y={cy} dy={16} textAnchor="middle" fill="#999" className="text-xs">
                {`${(percent * 100).toFixed(1)}%`}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 6}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 8}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
        </g>
    );
};

export function BreakdownChart({ title, data, type }: BreakdownChartProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const { theme } = useThemeStore();
    const isDarkMode = theme === 'dark';

    const chartData = useMemo(() => {
        return data.map((item) => ({
            name: type === 'symbol' ? item.symbol : item.session,
            value: item.totalTrades,
        })).filter(item => item.value > 0); // Only show items with trades
    }, [data, type]);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    if (!data || data.length === 0) {
        return (
            <div className="flex h-[300px] w-full items-center justify-center rounded-xl border border-border bg-card">
                <p className="text-muted-foreground">No data available for chart</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-4 text-lg font-semibold">{title} (Volume)</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            paddingAngle={2}
                        >
                            {chartData.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
                                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                                color: isDarkMode ? '#f8fafc' : '#0f172a'
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
