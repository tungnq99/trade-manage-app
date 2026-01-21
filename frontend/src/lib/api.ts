import axios from 'axios';
import { useAuthStore } from '@/store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - Tự động thêm auth token từ store
apiClient.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Xử lý lỗi
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Chỉ redirect khi token expired, KHÔNG phải khi login/register fail
        const isAuthRoute = error.config?.url?.includes('/api/auth/login') ||
            error.config?.url?.includes('/api/auth/register');

        if (error.response?.status === 401 && !isAuthRoute) {
            // Token expired hoặc invalid → Clear auth state
            useAuthStore.getState().clearAuth();

            // Dùng React Router navigate thay vì window.location (soft navigation)
            // Note: interceptor không có access đến navigate, nên vẫn phải dùng window.location
            // nhưng chỉ cho authenticated routes
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
