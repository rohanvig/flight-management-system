import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import './Home.css';

export const Home: React.FC = () => {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="container">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Find Your Perfect
                            <span className="gradient-text"> Flight</span>
                        </h1>
                        <p className="hero-subtitle">
                            Book flights to destinations worldwide with the best prices and seamless experience
                        </p>
                        <div className="hero-actions">
                            <Link to="/flights">
                                <Button variant="primary" size="lg">
                                    Search Flights
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="outline" size="lg">
                                    Get Started
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <h2 className="section-title">Why Choose FlightHub?</h2>

                    <div className="features-grid">
                        <Card variant="glass" hover className="feature-card">
                            <div className="feature-icon">🌍</div>
                            <h3 className="feature-title">Global Coverage</h3>
                            <p className="feature-description">
                                Access flights to thousands of destinations across the globe
                            </p>
                        </Card>

                        <Card variant="glass" hover className="feature-card">
                            <div className="feature-icon">💰</div>
                            <h3 className="feature-title">Best Prices</h3>
                            <p className="feature-description">
                                Get competitive prices and exclusive deals on every booking
                            </p>
                        </Card>

                        <Card variant="glass" hover className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3 className="feature-title">Instant Booking</h3>
                            <p className="feature-description">
                                Quick and easy booking process with instant confirmation
                            </p>
                        </Card>

                        <Card variant="glass" hover className="feature-card">
                            <div className="feature-icon">🔒</div>
                            <h3 className="feature-title">Secure Payments</h3>
                            <p className="feature-description">
                                Safe and encrypted payment processing for peace of mind
                            </p>
                        </Card>

                        <Card variant="glass" hover className="feature-card">
                            <div className="feature-icon">📱</div>
                            <h3 className="feature-title">24/7 Support</h3>
                            <p className="feature-description">
                                Round-the-clock customer support for all your needs
                            </p>
                        </Card>

                        <Card variant="glass" hover className="feature-card">
                            <div className="feature-icon">✈️</div>
                            <h3 className="feature-title">Easy Management</h3>
                            <p className="feature-description">
                                Manage all your bookings in one convenient dashboard
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <Card variant="gradient" className="cta-card">
                        <h2 className="cta-title">Ready to Take Off?</h2>
                        <p className="cta-description">
                            Start your journey today and discover amazing destinations
                        </p>
                        <Link to="/flights">
                            <Button variant="secondary" size="lg">
                                Book Your Flight Now
                            </Button>
                        </Link>
                    </Card>
                </div>
            </section>
        </div>
    );
};
