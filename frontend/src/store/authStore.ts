import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Interface cho User object
 */
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'admin' | 'user';
    createdAt?: string;
    hasCompletedOnboarding?: boolean; // Track if user completed onboarding
}

/**
 * Auth Store State Interface
 */
interface AuthState {
    // State
    token: string | null;
    refreshToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setAuth: (token: string, refreshToken: string, user: User) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
}

/**
 * Auth Store - Quản lý authentication state
 * Sử dụng persist middleware để lưu vào localStorage
 */
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            // Initial state
            token: null,
            refreshToken: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,

            // Actions
            setAuth: (token, refreshToken, user) =>
                set({
                    token,
                    refreshToken,
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                }),

            clearAuth: () =>
                set({
                    token: null,
                    refreshToken: null,
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                }),

            setLoading: (loading) =>
                set({
                    isLoading: loading,
                }),
        }),
        {
            name: 'auth-storage', // localStorage key
            partialize: (state) => ({
                token: state.token,
                refreshToken: state.refreshToken,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
