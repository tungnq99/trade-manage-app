import { create } from 'zustand';
import { capitalService } from '../services/capital.service';
import { CapitalSummary, UpdateCapitalDto } from '../types/capital.types';

interface CapitalState {
    summary: CapitalSummary | null;
    isLoading: boolean;
    error: string | null;
    fetchSummary: (force?: boolean) => Promise<void>;
    updateSettings: (settings: UpdateCapitalDto) => Promise<void>;
}

export const useCapitalStore = create<CapitalState>((set) => ({
    summary: null,
    isLoading: false,
    error: null,

    fetchSummary: async (force = false) => {
        const { summary, isLoading } = useCapitalStore.getState();

        // Cache hit: If data exists and not forced, return immediately
        if (summary && !force && !isLoading) {
            return;
        }

        // Request Deduplication: If already loading and not forced, don't trigger another fetch
        if (isLoading && !force) {
            return;
        }

        set({ isLoading: true, error: null });
        try {
            const result = await capitalService.getSummary();
            set({ summary: result, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to fetch capital summary', isLoading: false });
        }
    },

    updateSettings: async (settings) => {
        set({ isLoading: true, error: null });
        try {
            await capitalService.updateSettings(settings);
            // Re-fetch summary to update UI
            const summary = await capitalService.getSummary();
            set({ summary, isLoading: false });
        } catch (error: any) {
            set({ error: error.message || 'Failed to update settings', isLoading: false });
            throw error;
        }
    },
}));
