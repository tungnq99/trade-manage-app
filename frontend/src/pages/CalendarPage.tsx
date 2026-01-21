import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Filter, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { newsService, EconomicEvent } from '@/services/news.service';

type ImpactFilter = 'All' | 'High' | 'Medium' | 'Low';

const IMPACT_COLORS = {
    High: 'text-red-500',
    Medium: 'text-yellow-500',
    Low: 'text-gray-500'
};

export default function CalendarPage() {
    const { t } = useTranslation();
    const [events, setEvents] = useState<EconomicEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [impactFilter, setImpactFilter] = useState<ImpactFilter>('All');
    const [selectedCurrencies] = useState<string[]>(['USD', 'EUR', 'GBP', 'JPY']);

    useEffect(() => {
        fetchEvents();
    }, [impactFilter, selectedCurrencies]);

    const fetchEvents = async () => {
        setIsLoading(true);
        try {
            const filters = {
                currencies: selectedCurrencies.join(','),
                impact: impactFilter === 'All' ? undefined : impactFilter
            };

            const data = await newsService.getCalendar(filters);
            setEvents(data);
        } catch (error) {
            console.error('Failed to fetch economic calendar:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    if (isLoading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-muted rounded w-1/3 mx-auto" />
                    <div className="h-64 bg-muted rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 md:p-6 mb-20 md:mb-0">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <CalendarIcon className="h-6 w-6" />
                    {t('calendar.title')}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t('calendar.subtitle')}
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                {/* Impact Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('calendar.filters.impact')}:</span>
                    {(['All', 'High', 'Medium', 'Low'] as ImpactFilter[]).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setImpactFilter(filter)}
                            className={cn(
                                'rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                                impactFilter === filter
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            )}
                        >
                            {t(`calendar.filters.${filter.toLowerCase()}`)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                {events.length === 0 ? (
                    <div className="p-12 text-center">
                        <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">{t('calendar.empty.title')}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t('calendar.empty.message')}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-border bg-muted/50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('calendar.table.dateTime')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('calendar.table.currency')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('calendar.table.event')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('calendar.table.impact')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('calendar.table.forecast')}</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{t('calendar.table.previous')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {events.map((event) => (
                                    <tr key={event._id} className="hover:bg-muted/50 transition-colors">
                                        <td className="px-4 py-3 text-sm">{formatDate(event.date)}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                                {event.currency}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium">{event.event}</td>
                                        <td className="px-4 py-3">
                                            <span className={cn('text-xs font-semibold', IMPACT_COLORS[event.impact])}>
                                                {t(`calendar.filters.${event.impact.toLowerCase()}`)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {event.forecast || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-muted-foreground">
                                            {event.previous || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Disclaimer */}
            <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    ⚠️ <strong>{t('calendar.disclaimerLabel')}:</strong> {t('calendar.disclaimer')}
                </p>
            </div>
        </div>
    );
}
