import { apiClient } from '@/lib/api';
import type { ProfileUpdateFormData, PasswordChangeFormData } from '@/schemas/account.schema';

/**
 * Update user profile (firstName, lastName, email)
 * Backend endpoint: PUT /api/auth/profile
 */
export const updateProfile = async (data: ProfileUpdateFormData) => {
    const response = await apiClient.put('/api/auth/profile', data);
    return response.data;
};

/**
 * Change user password
 * Backend endpoint should be: POST /api/auth/change-password
 */
export const changePassword = async (data: PasswordChangeFormData) => {
    const response = await apiClient.post('/api/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
    });
    return response.data;
};
