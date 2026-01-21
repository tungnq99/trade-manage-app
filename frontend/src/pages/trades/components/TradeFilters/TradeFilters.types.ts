export interface TradeFilters {
    symbol?: string;
    direction?: 'long' | 'short';
    session?: 'asian' | 'london' | 'newyork';
    dateFrom?: string;
    dateTo?: string;
}

export interface TradeFiltersProps {
    filters: TradeFilters;
    onFiltersChange: (filters: TradeFilters) => void;
    onClearFilters: () => void;
}
