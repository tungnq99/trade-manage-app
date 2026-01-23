import { BaseModal } from '@/components/common/BaseModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { TradeDetailModalProps } from './TradeDetailModal.types';
import { useTranslation } from 'react-i18next';
import { getStrategyVariation } from '@/helpers/strategy.helper';

export function TradeDetailModal({ isOpen, onClose, onDelete, trade }: TradeDetailModalProps) {
    const { t } = useTranslation();

    if (!trade) return null;

    const InfoRow = ({ label, value, className = '' }: { label: string; value: string | number; className?: string }) => (
        <div className="flex justify-between items-center py-2 border-b border-border/20">
            <span className="text-sm text-muted-foreground">{label}</span>
            <span className={`text-sm ${className}`}>{value}</span>
        </div>
    );

    // Format date properly
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const variation = getStrategyVariation(trade.setup, trade.direction);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={
                <div>
                    <div className="text-xl font-bold">{trade.symbol}</div>
                    <div className="text-sm text-muted-foreground font-normal">
                        {formatDate(trade.entryDate)} • {trade.entryTime} - {formatDate(trade.exitDate)} • {trade.exitTime}
                    </div>
                </div>
            }
            size="lg"
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={() => {
                            onDelete(trade);
                            onClose();
                        }}
                        className="text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('trades.buttons.delete')}
                    </Button>
                    <Button onClick={onClose}>{t('common.close')}</Button>
                </>
            }
        >
            <div className="grid grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* Overview */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Badge variant={trade.direction === 'long' ? 'default' : 'destructive'} className="text-xs px-2 py-1">
                                {t('trades.status.' + trade.direction)}
                            </Badge>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">{trade.session} {t('trades.form.session')}</span>
                        </div>
                        <InfoRow className="font-semibold" label={t('trades.popup.lotSize')} value={trade.lotSize} />
                    </div>

                    {/* Position */}
                    <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Position</h4>
                        <InfoRow className="font-semibold" label={t('trades.table.columns.entryPrice')} value={trade.entryPrice.toFixed(3)} />
                        <InfoRow className="font-semibold" label={t('trades.table.columns.exitPrice')} value={trade.exitPrice.toFixed(3)} />
                    </div>

                    {/* TP/SL */}
                    <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">TP/SL</h4>
                        {trade.tp && <InfoRow className="text-success" label={t('trades.popup.takeProfit')} value={trade.tp} />}
                        {trade.sl && <InfoRow className="text-destructive" label={t('trades.popup.stopLoss')} value={trade.sl} />}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Performance */}
                    <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Performance</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">{t('trades.table.columns.pips')}</span>
                                <span className={`text-2xl font-bold ${trade.pips >= 0 ? 'text-success' : 'text-destructive'}`}>
                                    {trade.pips > 0 ? '+' : ''}{trade.pips.toFixed(1)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-border/30">
                                <span className="text-sm text-muted-foreground">{t('trades.table.columns.pnl')}</span>
                                <div className="text-right">
                                    <div className={`text-xl font-bold ${trade.profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                                        {trade.profitLoss >= 0 ? '+' : ''}${trade.profitLoss.toFixed(2)}
                                    </div>
                                    <div className={`text-xs ${trade.profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                                        {trade.profitLossPercent >= 0 ? '+' : ''}{trade.profitLossPercent.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Setup/Strategy */}
                    <div>
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{t('trades.table.columns.setup')}</h4>
                        <div className="text-sm bg-muted/20 p-4 rounded-lg border border-border/30 leading-relaxed">
                            <strong>{trade.setup}</strong>
                            {
                                variation && (
                                    <div className="space-y-1 mt-2 text-xs">
                                        <p>1. CVD Trades: {variation.cvdTrades}</p>
                                        <p>2. CVD Volume: {variation.cvdVolume}</p>
                                        <p>3. Giá: {variation.priceAction}</p>
                                        <p>4. Ý nghĩa: {variation.meaning}</p>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    {/* Notes */}
                    {trade.notes && (
                        <div>
                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{t('trades.popup.notes')}</h4>
                            <div className="text-sm bg-muted/20 p-4 rounded-lg border border-border/30 leading-relaxed">
                                {trade.notes}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BaseModal>
    );
}
