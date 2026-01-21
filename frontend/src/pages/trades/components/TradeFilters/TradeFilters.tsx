import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { TradeFiltersProps } from './TradeFilters.types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function TradeFilters({ filters, onFiltersChange, onClearFilters }: TradeFiltersProps) {
    const [isOpen, setIsOpen] = useState(false);
    const hasActiveFilters = Object.keys(filters).length > 0;
    const { t } = useTranslation();

    return (
        <div className="bg-card border border-border rounded-lg mb-6">
            {/* Header */}
            <div className="flex items-center justify-between p-4" >
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-sm">{t('trades.buttons.filter')}</h3>
                    {hasActiveFilters && (
                        <Badge variant="default" className="ml-2 h-5 text-[10px]">
                            {Object.keys(filters).length}
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClearFilters}
                            className="h-7 text-xs"
                        >
                            <X className="mr-1 h-3 w-3" />
                            {t('trades.form.clearAll')}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(!isOpen)}
                        className="h-7 w-7 p-0"
                    >
                        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {/* Collapsible Content */}
            {isOpen && (
                <div className="px-4 pb-4 border-t border-border pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        {/* Symbol */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">{t('trades.form.symbol')}</label>
                            <Input
                                placeholder="e.g. XAUUSD"
                                value={filters.symbol || ''}
                                onChange={(e) => {
                                    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                    onFiltersChange({ ...filters, symbol: val || undefined });
                                }}
                                className="h-9"
                            />
                        </div>

                        {/* Direction */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">{t('trades.form.direction')}</label>
                            <select
                                value={filters.direction || ''}
                                onChange={(e) => onFiltersChange({
                                    ...filters,
                                    direction: (e.target.value as 'long' | 'short') || undefined
                                })}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="">{t('trades.form.all')}</option>
                                <option value="long">{t('trades.status.long')}</option>
                                <option value="short">{t('trades.status.short')}</option>
                            </select>
                        </div>

                        {/* Session */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">{t('trades.form.session')}</label>
                            <select
                                value={filters.session || ''}
                                onChange={(e) => onFiltersChange({
                                    ...filters,
                                    session: (e.target.value as 'asian' | 'london' | 'newyork') || undefined
                                })}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                <option value="">{t('trades.form.all')}</option>
                                <option value="asian">{t('trades.form.asian')}</option>
                                <option value="london">{t('trades.form.london')}</option>
                                <option value="newyork">{t('trades.form.newyork')}</option>
                            </select>
                        </div>

                        {/* Date From */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">{t('trades.form.dateFrom')}</label>
                            <Input
                                type="date"
                                value={filters.dateFrom || ''}
                                onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value || undefined })}
                                className="h-9"
                            />
                        </div>

                        {/* Date To */}
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">{t('trades.form.dateTo')}</label>
                            <Input
                                type="date"
                                value={filters.dateTo || ''}
                                onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value || undefined })}
                                className="h-9"
                            />
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters && (
                        <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                            {filters.symbol && (
                                <Badge variant="default" className="gap-1">
                                    {t('trades.form.symbol')}: {filters.symbol}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => onFiltersChange({ ...filters, symbol: undefined })}
                                    />
                                </Badge>
                            )}
                            {filters.direction && (
                                <Badge variant="default" className="gap-1">
                                    {filters.direction.toUpperCase()}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => onFiltersChange({ ...filters, direction: undefined })}
                                    />
                                </Badge>
                            )}
                            {filters.session && (
                                <Badge variant="default" className="gap-1">
                                    {filters.session.charAt(0).toUpperCase() + filters.session.slice(1)}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => onFiltersChange({ ...filters, session: undefined })}
                                    />
                                </Badge>
                            )}
                            {filters.dateFrom && (
                                <Badge variant="default" className="gap-1">
                                    {t('trades.form.dateFrom')}: {new Date(filters.dateFrom).toLocaleDateString()}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => onFiltersChange({ ...filters, dateFrom: undefined })}
                                    />
                                </Badge>
                            )}
                            {filters.dateTo && (
                                <Badge variant="default" className="gap-1">
                                    {t('trades.form.dateTo')}: {new Date(filters.dateTo).toLocaleDateString()}
                                    <X
                                        className="h-3 w-3 cursor-pointer"
                                        onClick={() => onFiltersChange({ ...filters, dateTo: undefined })}
                                    />
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
