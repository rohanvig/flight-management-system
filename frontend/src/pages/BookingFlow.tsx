import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { flightApi } from '@/api/flight.api';
import { bookingApi } from '@/api/booking.api';
import { Flight } from '@/types/flight.types';
import { Passenger, CreateBookingData } from '@/types/booking.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { formatCurrency, formatDateTime, formatDuration } from '@/utils/formatters';
import './BookingFlow.css';

const STEPS = ['Passenger Details', 'Review Booking', 'Payment'];

export const BookingFlow: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    const [currentStep, setCurrentStep] = useState(0);
    const [flight, setFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // State for booking data
    const [passengers, setPassengers] = useState<Passenger[]>([
        {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: 'male',
            passportNumber: '',
        },
    ]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/book/${id}` } });
            return;
        }

        const loadFlight = async () => {
            try {
                if (!id) return;
                const data = await flightApi.getFlightById(id);
                setFlight(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load flight details');
            } finally {
                setLoading(false);
            }
        };

        loadFlight();
    }, [id, isAuthenticated, navigate]);

    const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
        const updatedPassengers = [...passengers];
        updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
        setPassengers(updatedPassengers);
    };

    const addPassenger = () => {
        setPassengers([
            ...passengers,
            {
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: 'male',
                passportNumber: '',
            },
        ]);
    };

    const removePassenger = (index: number) => {
        if (passengers.length === 1) return;
        const updatedPassengers = [...passengers];
        updatedPassengers.splice(index, 1);
        setPassengers(updatedPassengers);
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleCreateBooking = async () => {
        if (!flight) return;

        setSubmitting(true);
        try {
            const bookingData: CreateBookingData = {
                flightId: flight.id,
                passengers,
                seats: [], // Seat selection can be added here if implemented
            };

            const response = await bookingApi.createBooking(bookingData);

            // Navigate to payment page with booking reference
            navigate(`/payment/${response.reference}`);
        } catch (err: any) {
            setError(err.message || 'Failed to create booking');
            setSubmitting(false);
        }
    };

    if (loading) return <Loader fullScreen text="Loading flight details..." />;
    if (error) return <div className="container"><ErrorMessage message={error} /></div>;
    if (!flight) return <div className="container"><ErrorMessage message="Flight not found" /></div>;

    const renderStepIndicator = () => (
        <div className="steps-container">
            {STEPS.map((step, index) => (
                <div
                    key={index}
                    className={`step-item ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                >
                    <div className="step-circle">
                        {index < currentStep ? '✓' : index + 1}
                    </div>
                    <span className="step-label">{step}</span>
                    {index < STEPS.length - 1 && <div className="step-line"></div>}
                </div>
            ))}
        </div>
    );

    const renderPassengerForm = () => (
        <div className="booking-form">
            <h2 className="section-heading">Passenger Details</h2>
            {passengers.map((passenger, index) => (
                <Card key={index} variant="default" className="passenger-card">
                    <div className="passenger-header">
                        <h3>Passenger {index + 1}</h3>
                        {passengers.length > 1 && (
                            <Button type="button" variant="danger" size="sm" onClick={() => removePassenger(index)}>
                                Remove
                            </Button>
                        )}
                    </div>
                    <div className="form-grid">
                        <Input
                            label="First Name"
                            value={passenger.firstName}
                            onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                            required
                        />
                        <Input
                            label="Last Name"
                            value={passenger.lastName}
                            onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                            required
                        />
                        <div className="form-field">
                            <label className="input-label">Gender</label>
                            <select
                                className="form-select"
                                value={passenger.gender}
                                onChange={(e) => handlePassengerChange(index, 'gender', e.target.value as any)}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <Input
                            type="date"
                            label="Date of Birth"
                            value={passenger.dateOfBirth}
                            onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                            required
                        />
                        <Input
                            label="Passport Number"
                            value={passenger.passportNumber}
                            onChange={(e) => handlePassengerChange(index, 'passportNumber', e.target.value)}
                        />
                    </div>
                </Card>
            ))}
            <div className="form-actions">
                <Button variant="outline" onClick={addPassenger}>+ Add Passenger</Button>
                <Button variant="primary" onClick={handleNext}>Next: Review</Button>
            </div>
        </div>
    );

    const renderReview = () => (
        <div className="booking-review">
            <div className="review-grid">
                <div className="review-main">
                    <Card variant="default">
                        <h3 className="card-title">Flight Summary</h3>
                        <div className="flight-summary">
                            <div className="flight-route-simple">
                                <span className="airport-code">{flight.origin}</span>
                                <span className="arrow">→</span>
                                <span className="airport-code">{flight.destination}</span>
                            </div>
                            <div className="flight-times">
                                <div className="time-block">
                                    <span className="label">Departure</span>
                                    <span className="value">{formatDateTime(flight.departureTime)}</span>
                                </div>
                                <div className="time-block">
                                    <span className="label">Duration</span>
                                    <span className="value">{formatDuration(flight.duration)}</span>
                                </div>
                            </div>
                            <div className="flight-info">
                                <span>{flight.airline}</span> • <span>{flight.flightNumber}</span> • <span>{flight.class}</span>
                            </div>
                        </div>
                    </Card>

                    <Card variant="default" className="passengers-review">
                        <h3 className="card-title">Passengers ({passengers.length})</h3>
                        <div className="passengers-list-review">
                            {passengers.map((p, i) => (
                                <div key={i} className="passenger-item-review">
                                    <span className="p-name">{p.firstName} {p.lastName}</span>
                                    <span className="p-details">{p.gender}, {p.dateOfBirth}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div className="review-sidebar">
                    <Card variant="glass" className="price-summary">
                        <h3>Price Breakdown</h3>
                        <div className="price-row">
                            <span>{passengers.length} x Adult</span>
                            <span>{formatCurrency(flight.price * passengers.length)}</span>
                        </div>
                        <div className="price-row">
                            <span>Taxes & Fees</span>
                            <span>{formatCurrency(flight.price * 0.1 * passengers.length)}</span>
                        </div>
                        <div className="price-total">
                            <span>Total</span>
                            <span>{formatCurrency(flight.price * 1.1 * passengers.length)}</span>
                        </div>
                        <Button
                            variant="primary"
                            fullWidth
                            size="lg"
                            onClick={handleCreateBooking}
                            isLoading={submitting}
                        >
                            Confirm & Pay
                        </Button>
                        <Button
                            variant="ghost"
                            fullWidth
                            onClick={handleBack}
                            disabled={submitting}
                        >
                            Back to Edit
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );

    return (
        <div className="booking-page">
            <div className="container">
                {renderStepIndicator()}

                <div className="booking-content">
                    {currentStep === 0 && renderPassengerForm()}
                    {currentStep === 1 && renderReview()}
                </div>
            </div>
        </div>
    );
};
