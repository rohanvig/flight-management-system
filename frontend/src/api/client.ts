import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types/api.types';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL || 'http://localhost:3000';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach JWT token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        // Log response in development
        if (import.meta.env.DEV) {
            console.log(`[API Response] ${response.config.url}`, response.data);
        }
        return response;
    },
    (error: AxiosError) => {
        const apiError: ApiError = {
            message: 'An unexpected error occurred',
            status: error.response?.status || 500,
        };

        if (error.response) {
            // Server responded with error
            const data = error.response.data as any;
            apiError.message = data?.message || data?.error || error.message;
            apiError.errors = data?.errors;

            // Handle 401 Unauthorized - clear token and redirect to login
            if (error.response.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        } else if (error.request) {
            // Request made but no response
            apiError.message = 'Network error. Please check your connection.';
        }

        // Log error in development
        if (import.meta.env.DEV) {
            console.error('[API Error]', apiError);
        }

        return Promise.reject(apiError);
    }
);

export default apiClient;
