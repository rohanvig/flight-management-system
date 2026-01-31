import apiClient from './client';
import { Flight, FlightSearchParams, FlightSearchResponse, Airport } from '@/types/flight.types';

export const flightApi = {
    // Search flights
    searchFlights: async (params: FlightSearchParams): Promise<FlightSearchResponse> => {
        const response = await apiClient.get<FlightSearchResponse>('/api/flights/search', {
            params,
        });
        return response.data;
    },

    // Get all airports
    getAirports: async (): Promise<Airport[]> => {
        const response = await apiClient.get<Airport[]>('/api/flights/airports');
        return response.data;
    },

    // Get flight by ID
    getFlightById: async (id: string): Promise<Flight> => {
        const response = await apiClient.get<Flight>(`/api/flights/${id}`);
        return response.data;
    },
};
