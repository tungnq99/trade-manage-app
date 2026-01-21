import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'vi';
export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY';

interface ThemeState {
    theme: Theme;
    language: Language;
    dateFormat: DateFormat;
    toggleTheme: () => void;
    setTheme: (theme: Theme) => void;
    setLanguage: (language: Language) => void;
    setDateFormat: (format: DateFormat) => void;
}

/**
 * Apply theme to document root
 */
const applyTheme = (theme: Theme) => {
    const root = document.documentElement;

    if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.remove('light', 'dark');
        root.classList.add(systemTheme);
    } else {
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'dark',
            language: 'en',
            dateFormat: 'DD/MM/YYYY',

            toggleTheme: () => {
                const currentTheme = get().theme;
                const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
                set({ theme: nextTheme });
                applyTheme(nextTheme);
            },

            setTheme: (theme) => {
                set({ theme });
                applyTheme(theme);
            },

            setLanguage: (language) => set({ language }),

            setDateFormat: (format) => set({ dateFormat: format }),
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                // Apply theme after rehydration from localStorage
                if (state) {
                    applyTheme(state.theme);
                }
            },
        }
    )
);

/**
 * Initialize theme on app startup
 */
export const initializeTheme = () => {
    const { theme } = useThemeStore.getState();
    applyTheme(theme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const currentTheme = useThemeStore.getState().theme;
        if (currentTheme === 'system') {
            applyTheme('system');
        }
    });
};
