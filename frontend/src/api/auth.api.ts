import apiClient from './client';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth.types';
import { storage } from '@/utils/storage';

export const authApi = {
    // Login user
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/login', credentials);
        return response.data;
    },

    // Register new user
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/api/auth/register', data);
        return response.data;
    },

    // Get current user profile
    getMe: async (): Promise<User> => {
        const user = storage.get<User>('user');
        const response = await apiClient.get<User>('/api/auth/me', {
            params: {
                userId: user?.id,
            }
        });
        return response.data;
    },

    // Logout (client-side only)
    logout: () => {
        storage.remove('authToken');
        storage.remove('user');
    },
};
