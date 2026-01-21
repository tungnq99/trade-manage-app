import type { ProfileUpdateFormData, PasswordChangeFormData } from '@/schemas/account.schema';

// Mock delay helper
const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Update user profile (firstName, lastName, email)
 * TODO: Replace with real API when backend is ready
 * Backend endpoint should be: PUT /api/users/profile
 */
export const updateProfile = async (data: ProfileUpdateFormData) => {
    // Mock implementation - remove when backend ready
    await mockDelay(1000);

    // Simulate email uniqueness check failure (for testing)
    // if (data.email === 'taken@example.com') {
    //     throw { response: { data: { error: 'Email already exists' } } };
    // }

    // TODO: Uncomment when backend ready
    // const response = await api.put('/users/profile', data);
    // return response.data;

    // Mock response
    return {
        user: {
            ...data,
            id: 'mock-user-id',
        }
    };
};

/**
 * Change user password
 * TODO: Replace with real API when backend is ready
 * Backend endpoint should be: POST /api/users/change-password
 */
export const changePassword = async (data: PasswordChangeFormData) => {
    // Mock implementation - remove when backend ready
    await mockDelay(1000);

    // Simulate wrong current password (for testing)
    // if (data.currentPassword !== 'correct-password') {
    //     throw { response: { data: { error: 'Current password is incorrect' } } };
    // }

    // TODO: Uncomment when backend ready
    // const response = await api.post('/users/change-password', {
    //     currentPassword: data.currentPassword,
    //     newPassword: data.newPassword,
    // });
    return data;

    // Mock response
    return {
        message: 'Password changed successfully'
    };
};
