// Authentication & User Types
export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    createdAt: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
