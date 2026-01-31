import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { formatDateTime } from '@/utils/formatters';
import './Profile.css';

export const Profile: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Refresh user data on mount to ensure freshness
        const loadProfile = async () => {
            setLoading(true);
            try {
                await refreshUser();
            } catch (err: any) {
                setError(err.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we already have a user (which we should in a protected route)
        if (user) {
            loadProfile();
        }
    }, []);

    if (loading) return <Loader fullScreen text="Loading profile..." />;
    if (error) return <div className="container"><ErrorMessage message={error} /></div>;
    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="container container-sm">
                <h1 className="page-title gradient-text">My Profile</h1>

                <Card variant="glass" className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="profile-title">
                            <h2>{user.name}</h2>
                            <span className="profile-email">{user.email}</span>
                        </div>
                    </div>

                    <div className="profile-details">
                        <h3 className="section-title">Account Information</h3>

                        <div className="detail-group">
                            <label>Full Name</label>
                            <div className="detail-value">{user.name}</div>
                        </div>

                        <div className="detail-group">
                            <label>Email Address</label>
                            <div className="detail-value">{user.email}</div>
                        </div>

                        <div className="detail-group">
                            <label>Phone Number</label>
                            <div className="detail-value">{user.phone || 'Not provided'}</div>
                        </div>

                        <div className="detail-group">
                            <label>Member Since</label>
                            <div className="detail-value">{formatDateTime(user.createdAt)}</div>
                        </div>

                        <div className="detail-group">
                            <label>Account ID</label>
                            <div className="detail-value monospace">{user.id}</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
