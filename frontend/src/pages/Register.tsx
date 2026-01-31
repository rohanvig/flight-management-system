import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { isValidEmail, isValidPassword } from '@/utils/validators';
import './Login.css';

export const Register: React.FC = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!isValidPassword(formData.password)) {
            newErrors.password = 'Password must be at least 8 characters with 1 letter and 1 number';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');

        if (!validate()) return;

        setIsLoading(true);
        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            navigate('/');
        } catch (error: any) {
            setApiError(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <Card variant="glass" className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title gradient-text">Create Account</h1>
                        <p className="auth-subtitle">Join us and start booking your flights</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {apiError && (
                            <div className="auth-error">
                                {apiError}
                            </div>
                        )}

                        <Input
                            type="text"
                            name="name"
                            label="Full Name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            fullWidth
                            required
                        />

                        <Input
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            fullWidth
                            required
                        />

                        <Input
                            type="tel"
                            name="phone"
                            label="Phone Number"
                            placeholder="Enter your phone number (optional)"
                            value={formData.phone}
                            onChange={handleChange}
                            error={errors.phone}
                            fullWidth
                        />

                        <Input
                            type="password"
                            name="password"
                            label="Password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                            fullWidth
                            required
                        />

                        <Input
                            type="password"
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={errors.confirmPassword}
                            fullWidth
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={isLoading}
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Already have an account?{' '}
                            <Link to="/login" className="auth-link">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
};
