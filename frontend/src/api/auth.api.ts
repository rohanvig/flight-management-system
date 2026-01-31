import apiClient from './client';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types/auth.types';

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
        const response = await apiClient.get<User>('/api/auth/me');
        return response.data;
    },

    // Logout (client-side only)
    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
    },
};
