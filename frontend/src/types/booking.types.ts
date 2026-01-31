// Booking Types
export interface Passenger {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: 'male' | 'female' | 'other';
    passportNumber?: string;
}

export interface Booking {
    id: string;
    reference: string;
    userId: string;
    flightId: string;
    passengers: Passenger[];
    seats: string[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
    updatedAt: string;
}

export interface CreateBookingData {
    flightId: string;
    passengers: Passenger[];
    seats?: string[];
    extras?: {
        baggage?: number;
        meal?: string;
    };
}

export interface BookingResponse {
    booking: Booking;
    reference: string;
}
