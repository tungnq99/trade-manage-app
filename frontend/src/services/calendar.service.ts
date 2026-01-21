import { apiClient } from '@/lib/api';
import { CalendarData } from '@/types/calendar.types';

export const calendarService = {
    getCalendar: async (month: string): Promise<CalendarData> => {
        const response = await apiClient.get(`/api/trades/calendar?month=${month}`);
        return response.data;
    },
};
