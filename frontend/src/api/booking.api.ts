import apiClient from './client';
import { Booking, CreateBookingData, BookingResponse } from '@/types/booking.types';

export const bookingApi = {
    // Create new booking
    createBooking: async (data: CreateBookingData): Promise<BookingResponse> => {
        const response = await apiClient.post<BookingResponse>('/api/bookings/create', data);
        return response.data;
    },

    // Get booking by reference
    getBookingByRef: async (reference: string): Promise<Booking> => {
        const response = await apiClient.get<Booking>(`/api/bookings/refrence/${reference}`);
        return response.data;
    },

    // Confirm booking after payment
    confirmBooking: async (reference: string): Promise<Booking> => {
        const response = await apiClient.post<Booking>(`/api/bookings/confirm/${reference}`);
        return response.data;
    },

    // Get all bookings for current user
    getMyBookings: async (): Promise<Booking[]> => {
        const response = await apiClient.get<Booking[]>('/api/bookings/mybookings');
        return response.data;
    },

    // Update seat selection
    updateSeats: async (reference: string, seats: string[]): Promise<Booking> => {
        const response = await apiClient.patch<Booking>(`/api/bookings/${reference}/seats`, {
            seats,
        });
        return response.data;
    },
};
