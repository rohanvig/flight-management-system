import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, AuthResponse } from '@/types/auth.types';
import { authApi } from '@/api/auth.api';
import { storage } from '@/utils/storage';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = storage.get<string>('authToken');
            const savedUser = storage.get<User>('user');

            if (token && savedUser) {
                setUser(savedUser);
                // Optionally refresh user data from server
                try {
                    const freshUser = await authApi.getMe();
                    setUser(freshUser);
                    storage.set('user', freshUser);
                } catch (error) {
                    // Token might be invalid, clear it
                    storage.remove('authToken');
                    storage.remove('user');
                    setUser(null);
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response: AuthResponse = await authApi.login(credentials);

            // Store token and user
            storage.set('authToken', response.token);
            storage.set('user', response.user);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            const response: AuthResponse = await authApi.register(data);

            // Store token and user
            storage.set('authToken', response.token);
            storage.set('user', response.user);
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        try {
            const freshUser = await authApi.getMe();
            setUser(freshUser);
            storage.set('user', freshUser);
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
