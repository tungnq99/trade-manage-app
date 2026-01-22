import axios from 'axios';
import { useAuthStore } from '@/store';
import { refreshAccessToken } from '@/services/auth.service';

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

// Token refresh state
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Response interceptor - Xử lý lỗi và tự động refresh token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Chỉ redirect khi token expired, KHÔNG phải khi login/register fail
        const isAuthRoute = error.config?.url?.includes('/api/auth/login') ||
            error.config?.url?.includes('/api/auth/register') ||
            error.config?.url?.includes('/api/auth/refresh');

        // Nếu lỗi 401 và không phải auth route
        if (error.response?.status === 401 && !isAuthRoute && !originalRequest._retry) {
            // Nếu đang refresh, queue request này
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const { refreshToken } = useAuthStore.getState();

            if (!refreshToken) {
                // Không có refresh token → logout
                useAuthStore.getState().clearAuth();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            try {
                // Gọi API refresh token
                const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(refreshToken);

                // Lưu token mới vào store
                const { user } = useAuthStore.getState();
                if (user) {
                    useAuthStore.getState().setAuth(accessToken, newRefreshToken, user);
                }

                // Process queue với token mới
                processQueue(null, accessToken);

                // Retry request gốc với token mới
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                // Refresh token cũng fail → logout
                processQueue(refreshError, null);
                useAuthStore.getState().clearAuth();
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
