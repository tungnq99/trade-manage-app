import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { TradeCardProps } from './TradeCard.types';
import { useTranslation } from 'react-i18next';

export function TradeCard({ trade, onEdit, onDelete, onClick }: TradeCardProps) {
    const { t } = useTranslation();
    return (
        <div
            className="bg-card border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
            onClick={() => onClick(trade)}
        >
            {/* Header: Symbol + Direction + Actions */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{trade.symbol}</span>
                    <Badge variant={trade.direction === 'long' ? 'default' : 'destructive'} className="text-xs">
                        {t(`trades.status.${trade.direction}`).toUpperCase()}
                    </Badge>
                </div>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(trade)}
                        className="h-8 w-8 p-0"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(trade)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* P/L - Most Important */}
            <div className="mb-3">
                <div className={`text-2xl font-bold ${trade.profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {trade.profitLoss >= 0 ? '+' : ''}${trade.profitLoss.toFixed(2)}
                </div>
                <div className={`text-sm ${trade.profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {trade.profitLossPercent >= 0 ? '+' : ''}{trade.profitLossPercent.toFixed(2)}% • {trade.pips > 0 ? '+' : ''}{trade.pips.toFixed(1)} pips
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                    <div className="text-muted-foreground text-xs">{t('trades.table.columns.entryPrice')}</div>
                    <div className="font-medium">{trade.entryPrice.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground">{trade.entryTime}</div>
                </div>
                <div>
                    <div className="text-muted-foreground text-xs">{t('trades.table.columns.exitPrice')}</div>
                    <div className="font-medium">{trade.exitPrice.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground">{trade.exitTime}</div>
                </div>
            </div>

            {/* Footer: Setup + Date */}
            <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate flex-1">{trade.setup}</span>
                <span className="ml-2">{new Date(trade.entryDate).toLocaleDateString()}</span>
            </div>
        </div>
    );
}
