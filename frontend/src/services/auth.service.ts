import { apiClient } from '@/lib/api';
import { useAuthStore, User } from '@/store';

/**
 * Auth Service - Tất cả API calls liên quan đến authentication
 * Theo Service Pattern: UI không gọi trực tiếp API
 */

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: User;
    message?: string;
}

/**
 * Đăng ký user mới
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
    return response.data;
};

/**
 * Đăng nhập
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/api/auth/login', data);
    return response.data;
};

/**
 * Lấy thông tin user hiện tại
 */
export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get<{ user: User }>('/api/auth/me');
    return response.data.user;
};

/**
 * Logout - Clear auth state
 */
export const logout = () => {
    useAuthStore.getState().clearAuth();
};
