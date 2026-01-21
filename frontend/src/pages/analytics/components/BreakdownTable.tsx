import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { BreakdownItem } from '@/services/analytics.service';
import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface BreakdownTableProps {
    title: string;
    data: BreakdownItem[];
    type: 'symbol' | 'session';
}

export function BreakdownTable({ title, data, type }: BreakdownTableProps) {
    if (!data || data.length === 0) {
        return (
            <div className="rounded-xl border border-border bg-card p-6 text-center">
                <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">No data available</p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-border bg-card">
            <div className="border-b border-border p-4">
                <h3 className="font-semibold text-foreground">{title}</h3>
            </div>
            <div className="relative w-full overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px]">
                                {type === 'symbol' ? 'Symbol' : 'Session'}
                            </TableHead>
                            <TableHead className="text-right">Trades</TableHead>
                            <TableHead className="text-right">Win Rate</TableHead>
                            <TableHead className="text-right">P&L</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item, index) => {
                            const label = type === 'symbol' ? item.symbol || 'Unknown' : item.session || 'Unknown';
                            const isPositive = item.totalPnl > 0;
                            const isNegative = item.totalPnl < 0;

                            return (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{label}</TableCell>
                                    <TableCell className="text-right">{item.totalTrades}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <span>{item.winRate.toFixed(1)}%</span>
                                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                                                <div
                                                    className="h-full bg-primary"
                                                    style={{ width: `${item.winRate}%` }}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className={cn(
                                        "text-right font-medium flex items-center justify-end gap-1",
                                        isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-muted-foreground"
                                    )}>
                                        {isPositive && <ArrowUp className="h-3 w-3" />}
                                        {isNegative && <ArrowDown className="h-3 w-3" />}
                                        {!isPositive && !isNegative && <Minus className="h-3 w-3" />}
                                        ${Math.abs(item.totalPnl).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
