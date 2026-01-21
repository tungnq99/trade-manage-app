import { apiClient } from '@/lib/api';

export interface EconomicEvent {
    _id: string;
    date: string;
    currency: string;
    event: string;
    impact: 'High' | 'Medium' | 'Low';
    forecast?: string;
    previous?: string;
    actual?: string;
    source: string;
    lastUpdated: string;
    createdAt: string;
}

export interface CalendarFilters {
    dateFrom?: string;
    dateTo?: string;
    currencies?: string;  // Comma-separated: "USD,EUR"
    impact?: 'High' | 'Medium' | 'Low';
}

export const newsService = {
    getCalendar: async (filters?: CalendarFilters): Promise<EconomicEvent[]> => {
        const params = new URLSearchParams();

        if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
        if (filters?.dateTo) params.append('dateTo', filters.dateTo);
        if (filters?.currencies) params.append('currencies', filters.currencies);
        if (filters?.impact) params.append('impact', filters.impact);

        const response = await apiClient.get(`/api/news/calendar?${params.toString()}`);
        return response.data.data.events;
    }
};
