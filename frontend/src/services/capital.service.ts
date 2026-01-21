import { apiClient as api } from '@/lib/api';
import { CapitalSummary, UpdateCapitalDto } from '../types/capital.types';

export const capitalService = {
    getSummary: async (): Promise<CapitalSummary> => {
        const response = await api.get('/api/capitals/summary');
        return response.data;
    },

    updateSettings: async (data: UpdateCapitalDto): Promise<CapitalSummary> => {
        const response = await api.post('/api/capitals/settings', data);
        return response.data;
    },
};
