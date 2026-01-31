// Flight Types
export interface Airport {
    code: string;
    name: string;
    city: string;
    country: string;
}

export interface Flight {
    id: string;
    flightNumber: string;
    airline: string;
    origin: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    duration: number; // in minutes
    price: number;
    availableSeats: number;
    class: 'economy' | 'business' | 'first';
}

export interface FlightSearchParams {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    passengers: number;
    class?: 'economy' | 'business' | 'first';
}

export interface FlightSearchResponse {
    flights: Flight[];
    total: number;
}
