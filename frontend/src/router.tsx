import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { FlightSearch } from './pages/FlightSearch';
import { MyBookings } from './pages/MyBookings';
import { BookingFlow } from './pages/BookingFlow';
import { Payment } from './pages/Payment';
import { Profile } from './pages/Profile';

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/flights" element={<FlightSearch />} />

                    {/* Protected Routes */}
                    <Route
                        path="/book/:id"
                        element={
                            <ProtectedRoute>
                                <BookingFlow />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/payment/:reference"
                        element={
                            <ProtectedRoute>
                                <Payment />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/my-bookings"
                        element={
                            <ProtectedRoute>
                                <MyBookings />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
};
