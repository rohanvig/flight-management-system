import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../common/Button';
import './Header.css';

export const Header: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="header-logo">
                        <span className="logo-icon">✈️</span>
                        <span className="logo-text gradient-text">FlightHub</span>
                    </Link>

                    <nav className="header-nav">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                        <Link to="/flights" className="nav-link">
                            Flights
                        </Link>
                        {isAuthenticated && (
                            <Link to="/my-bookings" className="nav-link">
                                My Bookings
                            </Link>
                        )}
                    </nav>

                    <div className="header-actions">
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="user-menu">
                                    <div className="user-avatar">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <span className="user-name">{user?.name}</span>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="primary" size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};
