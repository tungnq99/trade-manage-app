import { useState, useEffect, useMemo, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable, Pagination, DataTableColumn } from '@/components/common/DataTable';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { Trade } from '@/types/trade.types';
import { tradeService } from '@/services/trade.service';
import { toast } from 'sonner';
import { AddTradeModal } from './components/AddTradeModal';
import { EditTradeModal } from './components/EditTradeModal';
import { TradeDetailModal } from './components/TradeDetailModal';
import { TradeCard } from './components/TradeCard';
import { TradeFilters, TradeFiltersType } from './components/TradeFilters';
import { useDebounce } from '@/hooks/useDebounce';
import { useCapitalStore } from '@/store/useCapitalStore';
import { useTranslation } from 'react-i18next';

export function TradesPage() {
    const { t } = useTranslation();
    const { fetchSummary } = useCapitalStore();
    const [trades, setTrades] = useState<Trade[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [filters, setFilters] = useState<TradeFiltersType>({});
    const limit = 20;

    // Debounce filters để tránh spam API khi user đang gõ
    const debouncedFilters = useDebounce(filters, 500);

    // Fetch trades
    useEffect(() => {
        fetchTrades();
    }, [page, debouncedFilters]);

    const fetchTrades = useCallback(async () => {
        try {
            setLoading(true);
            const response = await tradeService.getTrades({
                page,
                limit,
                ...debouncedFilters
            });
            setTrades(response.trades);
            setTotalPages(response.pagination.pages);
            setTotalItems(response.pagination.total);
        } catch (error) {
            toast.error(t('trades.messages.fetchError'));
            console.error('Error fetching trades:', error);
        } finally {
            setLoading(false);
        }
    }, [page, debouncedFilters]);

    const handleClearFilters = useCallback(() => {
        setFilters({});
        setPage(1);
    }, []);

    // Delete trade
    const handleDeleteClick = useCallback((trade: Trade) => {
        setSelectedTrade(trade);
        setIsDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!selectedTrade) return;

        try {
            setDeleting(true);
            await tradeService.deleteTrade(selectedTrade._id);
            toast.success(t('trades.messages.deleteSuccess'));
            setIsDeleteDialogOpen(false);
            setSelectedTrade(null);
            fetchTrades();
            // Invalidate capital cache to refresh Dashboard
            fetchSummary(true);
        } catch (error) {
            toast.error(t('trades.messages.deleteError'));
            console.error('Error deleting trade:', error);
        } finally {
            setDeleting(false);
        }
    }, [selectedTrade, fetchTrades, fetchSummary]);

    // Define table columns
    const columns = useMemo<DataTableColumn<Trade>[]>(() => [
        {
            header: t('trades.table.columns.symbol'),
            cell: (trade) => (
                <div className="flex items-center gap-2">
                    <span className="font-medium">{trade.symbol}</span>
                    <Badge
                        variant={trade.direction === 'long' ? 'success' : 'destructive'}
                        className="text-[10px] px-1.5 py-0.5 h-5"
                    >
                        {t('trades.status.' + trade.direction)}
                    </Badge>
                </div>
            ),
        },
        {
            header: t('trades.table.columns.time'),
            cell: (trade) => (
                <div className="text-sm">
                    <div>{new Date(trade.entryDate).toLocaleDateString()}</div>
                    <div className="text-muted-foreground">{trade.entryTime}</div>
                </div>
            ),
        },
        {
            header: t('trades.table.columns.entryPrice'),
            cell: (trade) => <div className="text-sm tabular-nums">{trade.entryPrice.toFixed(3)}</div>,
        },
        {
            header: t('trades.table.columns.exitPrice'),
            cell: (trade) => <div className="text-sm tabular-nums">{trade.exitPrice.toFixed(3)}</div>,
        },
        {
            header: t('trades.table.columns.pips'),
            cell: (trade) => (
                <div className={`font-medium tabular-nums ${trade.pips >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {trade.pips >= 0 ? '+' : ''}{trade.pips.toFixed(1)}
                </div>
            ),
        },
        {
            header: t('trades.table.columns.pnl'),
            cell: (trade) => (
                <div className={`font-semibold tabular-nums ${trade.profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {trade.profitLoss >= 0 ? '+' : ''}${trade.profitLoss.toFixed(2)}
                </div>
            ),
        },
        {
            header: t('trades.table.columns.setup'),
            cell: (trade) => (
                <Badge variant="default" className="text-xs">
                    {trade.setup}
                </Badge>
            ),
        },
        {
            header: t('trades.table.columns.actions'),
            cell: (trade) => (
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTrade(trade);
                            setIsEditModalOpen(true);
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(trade);
                        }}
                    >
                        <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                </div>
            ),
        },
    ], [handleDeleteClick]);

    return (
        <div className="container mx-auto py-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t('trades.title')}</h1>
                    <p className="text-muted-foreground">{t('trades.subtitle')}</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('trades.buttons.add')}
                </Button>
            </div>

            {/* Filters */}
            <TradeFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClearFilters={handleClearFilters}
            />

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <DataTable
                    columns={columns}
                    data={trades}
                    loading={loading}
                    onRowClick={(trade) => {
                        setSelectedTrade(trade);
                        setIsDetailModalOpen(true);
                    }}
                />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : trades.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No trades found</div>
                ) : (
                    trades.map((trade) => (
                        <TradeCard
                            key={trade._id}
                            trade={trade}
                            onEdit={(trade) => {
                                setSelectedTrade(trade);
                                setIsEditModalOpen(true);
                            }}
                            onDelete={handleDeleteClick}
                            onClick={(trade) => {
                                setSelectedTrade(trade);
                                setIsDetailModalOpen(true);
                            }}
                        />
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={limit}
                    onPageChange={setPage}
                />
            )}

            {/* Add/Edit/Detail Modals */}
            <AddTradeModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onTradeAdded={() => {
                    fetchTrades();
                    fetchSummary(true); // Invalidate cache
                }}
            />
            <EditTradeModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedTrade(null);
                }}
                onTradeUpdated={() => {
                    fetchTrades();
                    fetchSummary(true); // Invalidate cache
                }}
                trade={selectedTrade!}
            />
            <TradeDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false);
                    setSelectedTrade(null);
                }}
                onDelete={(trade) => {
                    handleDeleteClick(trade);
                }}
                trade={selectedTrade}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setSelectedTrade(null);
                }}
                onConfirm={handleDeleteConfirm}
                title={t('popup.deletePopup.confirmDelete')}
                description={t('popup.deletePopup.confirmDeleteDesc', { symbol: selectedTrade?.symbol })}
                loading={deleting}
            />
        </div>
    );
}
