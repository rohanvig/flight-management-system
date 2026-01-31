import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightApi } from '@/api/flight.api';
import { Flight, Airport } from '@/types/flight.types';
import { useApi } from '@/hooks/useApi';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Loader } from '@/components/common/Loader';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { formatCurrency, formatTime, formatDuration } from '@/utils/formatters';
import './FlightSearch.css';

export const FlightSearch: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useState({
        origin: '',
        destination: '',
        departureDate: '',
        passengers: 1,
    });

    const [airports, setAirports] = useState<Airport[]>([]);
    const { data: flights, loading, error, execute: searchFlights } = useApi(flightApi.searchFlights);

    useEffect(() => {
        // Load airports on mount
        const loadAirports = async () => {
            try {
                const data = await flightApi.getAirports();
                setAirports(data);
            } catch (err) {
                console.error('Failed to load airports:', err);
            }
        };
        loadAirports();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        await searchFlights(searchParams);
    };

    return (
        <div className="flight-search-page">
            <div className="container">
                <h1 className="page-title gradient-text">Search Flights</h1>

                {/* Search Form */}
                <Card variant="glass" className="search-card">
                    <form onSubmit={handleSearch} className="search-form">
                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="origin" className="form-label">From</label>
                                <select
                                    id="origin"
                                    name="origin"
                                    value={searchParams.origin}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select origin</option>
                                    {airports.map(airport => (
                                        <option key={airport.code} value={airport.code}>
                                            {airport.city} ({airport.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label htmlFor="destination" className="form-label">To</label>
                                <select
                                    id="destination"
                                    name="destination"
                                    value={searchParams.destination}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select destination</option>
                                    {airports.map(airport => (
                                        <option key={airport.code} value={airport.code}>
                                            {airport.city} ({airport.code})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <Input
                                type="date"
                                name="departureDate"
                                label="Departure Date"
                                value={searchParams.departureDate}
                                onChange={handleChange}
                                fullWidth
                                required
                            />

                            <Input
                                type="number"
                                name="passengers"
                                label="Passengers"
                                value={searchParams.passengers}
                                onChange={handleChange}
                                min="1"
                                max="9"
                                fullWidth
                                required
                            />
                        </div>

                        <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
                            Search Flights
                        </Button>
                    </form>
                </Card>

                {/* Results */}
                {loading && <Loader text="Searching for flights..." />}

                {error && (
                    <ErrorMessage
                        message={error.message}
                        onRetry={() => searchFlights(searchParams)}
                    />
                )}

                {flights && flights.flights && flights.flights.length > 0 && (
                    <div className="results-section">
                        <h2 className="results-title">Available Flights ({flights.total})</h2>
                        <div className="flights-list">
                            {flights.flights.map((flight: Flight) => (
                                <Card key={flight.id} variant="default" hover className="flight-card">
                                    <div className="flight-header">
                                        <div className="airline-info">
                                            <h3 className="airline-name">{flight.airline}</h3>
                                            <p className="flight-number">{flight.flightNumber}</p>
                                        </div>
                                        <div className="flight-price">
                                            <span className="price-amount">{formatCurrency(flight.price)}</span>
                                            <span className="price-label">per person</span>
                                        </div>
                                    </div>

                                    <div className="flight-details">
                                        <div className="flight-route">
                                            <div className="route-point">
                                                <span className="route-time">{formatTime(flight.departureTime)}</span>
                                                <span className="route-code">{flight.origin}</span>
                                            </div>
                                            <div className="route-duration">
                                                <div className="route-line"></div>
                                                <span className="duration-text">{formatDuration(flight.duration)}</span>
                                            </div>
                                            <div className="route-point">
                                                <span className="route-time">{formatTime(flight.arrivalTime)}</span>
                                                <span className="route-code">{flight.destination}</span>
                                            </div>
                                        </div>

                                        <div className="flight-meta">
                                            <span className="meta-item">Class: {flight.class}</span>
                                            <span className="meta-item">Seats: {flight.availableSeats}</span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={() => navigate(`/book/${flight.id}`)}
                                    >
                                        Book Now
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {flights && flights.flights && flights.flights.length === 0 && (
                    <Card variant="default" className="no-results">
                        <p>No flights found for your search criteria. Please try different dates or destinations.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};
