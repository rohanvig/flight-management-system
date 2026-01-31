import React, { useEffect } from 'react';
import { bookingApi } from '@/api/booking.api';
import { Booking } from '@/types/booking.types';
import { useApi } from '@/hooks/useApi';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
import './MyBookings.css';

export const MyBookings: React.FC = () => {
    const { data: bookings, loading, error, execute: fetchBookings } = useApi(bookingApi.getMyBookings);

    useEffect(() => {
        fetchBookings();
    }, []);

    if (loading) {
        return <Loader fullScreen text="Loading your bookings..." />;
    }

    if (error) {
        return (
            <div className="container" style={{ paddingTop: '2rem' }}>
                <ErrorMessage message={error.message} onRetry={fetchBookings} />
            </div>
        );
    }

    return (
        <div className="my-bookings-page">
            <div className="container">
                <h1 className="page-title gradient-text">My Bookings</h1>

                {bookings && bookings.length > 0 ? (
                    <div className="bookings-list">
                        {bookings.map((booking: Booking) => (
                            <Card key={booking.id} variant="default" hover className="booking-card">
                                <div className="booking-header">
                                    <div className="booking-ref">
                                        <span className="ref-label">Booking Reference</span>
                                        <span className="ref-code">{booking.reference}</span>
                                    </div>
                                    <div className={`booking-status status-${booking.status}`}>
                                        {booking.status.toUpperCase()}
                                    </div>
                                </div>

                                <div className="booking-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Flight ID:</span>
                                        <span className="detail-value">{booking.flightId}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Passengers:</span>
                                        <span className="detail-value">{booking.passengers.length}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Seats:</span>
                                        <span className="detail-value">{booking.seats.join(', ') || 'Not assigned'}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Booked on:</span>
                                        <span className="detail-value">{formatDateTime(booking.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="booking-footer">
                                    <div className="booking-total">
                                        <span className="total-label">Total Amount</span>
                                        <span className="total-amount">{formatCurrency(booking.totalAmount)}</span>
                                    </div>
                                </div>

                                {booking.passengers.length > 0 && (
                                    <div className="passengers-section">
                                        <h4 className="passengers-title">Passengers</h4>
                                        <div className="passengers-list">
                                            {booking.passengers.map((passenger, index) => (
                                                <div key={index} className="passenger-item">
                                                    <span className="passenger-name">
                                                        {passenger.firstName} {passenger.lastName}
                                                    </span>
                                                    <span className="passenger-meta">
                                                        {passenger.gender} • DOB: {passenger.dateOfBirth}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card variant="default" className="no-bookings">
                        <div className="no-bookings-content">
                            <div className="no-bookings-icon">✈️</div>
                            <h2>No Bookings Yet</h2>
                            <p>You haven't made any flight bookings yet. Start exploring!</p>
                            <a href="/flights" className="explore-link">
                                Search Flights
                            </a>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};
