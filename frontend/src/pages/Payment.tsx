import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingApi } from '@/api/booking.api';
import { paymentApi } from '@/api/payment.api';
import { Booking } from '@/types/booking.types';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { formatCurrency } from '@/utils/formatters';
import './Payment.css';

export const Payment: React.FC = () => {
    const { reference } = useParams<{ reference: string }>();
    const navigate = useNavigate();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [paymentStep, setPaymentStep] = useState<'initial' | 'processing' | 'success'>('initial');

    useEffect(() => {
        const loadBooking = async () => {
            try {
                if (!reference) return;
                const data = await bookingApi.getBookingByRef(reference);
                setBooking(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        loadBooking();
    }, [reference]);

    const handlePayment = async () => {
        if (!booking) return;

        setProcessing(true);
        setPaymentStep('processing');

        try {
            // 1. Create payment intent (simulated or real)
            await paymentApi.createPaymentIntent(booking.totalAmount, booking.reference);

            // Simulate payment processing time
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 2. Confirm booking
            await bookingApi.confirmBooking(booking.reference);

            setPaymentStep('success');
            setProcessing(false);

            // Redirect after success
            setTimeout(() => {
                navigate('/my-bookings');
            }, 3000);

        } catch (err: any) {
            setError(err.message || 'Payment failed. Please try again.');
            setProcessing(false);
            setPaymentStep('initial');
        }
    };

    if (loading) return <Loader fullScreen text="Loading booking details..." />;
    if (error) return <div className="container"><ErrorMessage message={error} /></div>;
    if (!booking) return <div className="container"><ErrorMessage message="Booking not found" /></div>;

    return (
        <div className="payment-page">
            <div className="container container-sm">
                <Card variant="default" className="payment-card">
                    {paymentStep === 'initial' && (
                        <>
                            <div className="payment-header">
                                <h1 className="payment-title">Checkout</h1>
                                <p className="payment-subtitle">Complete your payment to confirm booking</p>
                            </div>

                            <div className="payment-summary">
                                <div className="summary-row">
                                    <span>Booking Reference</span>
                                    <span className="reference-code">{booking.reference}</span>
                                </div>
                                <div className="summary-row total-row">
                                    <span>Total Amount</span>
                                    <span className="amount">{formatCurrency(booking.totalAmount)}</span>
                                </div>
                            </div>

                            <div className="payment-form-mock">
                                <h3>Payment Details</h3>
                                <div className="card-mock">
                                    <div className="card-input">
                                        <label>Card Number</label>
                                        <input type="text" placeholder="**** **** **** 4242" disabled />
                                    </div>
                                    <div className="card-row">
                                        <div className="card-input">
                                            <label>Expiry</label>
                                            <input type="text" placeholder="MM/YY" disabled />
                                        </div>
                                        <div className="card-input">
                                            <label>CVC</label>
                                            <input type="text" placeholder="***" disabled />
                                        </div>
                                    </div>
                                </div>
                                <p className="mock-note">
                                    * This is a demo payment environment. No actual card charged.
                                </p>
                            </div>

                            <Button
                                variant="primary"
                                fullWidth
                                size="lg"
                                onClick={handlePayment}
                                isLoading={processing}
                            >
                                Pay {formatCurrency(booking.totalAmount)}
                            </Button>
                        </>
                    )}

                    {paymentStep === 'processing' && (
                        <div className="payment-status">
                            <Loader size="lg" />
                            <h2>Processing Payment...</h2>
                            <p>Please do not close this window.</p>
                        </div>
                    )}

                    {paymentStep === 'success' && (
                        <div className="payment-status success">
                            <div className="success-icon">🎉</div>
                            <h2>Payment Successful!</h2>
                            <p>Your booking has been confirmed.</p>
                            <p className="redirect-text">Redirecting to your bookings...</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};
