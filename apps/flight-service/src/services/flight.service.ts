import { Op } from 'sequelize';
import { Flight, Airport, Aircraft, Schedule } from '../models/index.js';

export class FlightService {
    private mapFlightToDto(flight: any) {
        // Ensure we handle both Sequelize instances and plain objects
        const data = typeof flight.get === 'function' ? flight.get({ plain: true }) : flight;
        
        const departureAirport = data.departureAirport;
        const arrivalAirport = data.arrivalAirport;
        const schedules = Array.isArray(data.schedules) ? data.schedules : [];
        const earliestSchedule = schedules.length
            ? schedules.reduce((earliest: any, current: any) => {
                const earliestTime = new Date(earliest.departure_time).getTime();
                const currentTime = new Date(current.departure_time).getTime();
                return currentTime < earliestTime ? current : earliest;
            })
            : null;

        const departureTime = earliestSchedule?.departure_time ?? null;
        const arrivalTime = earliestSchedule?.arrival_time ?? null;
        const duration = departureTime && arrivalTime
            ? Math.max(
                0,
                Math.round(
                    (new Date(arrivalTime).getTime() - new Date(departureTime).getTime()) / (1000 * 60)
                )
            )
            : 0;

        // Log for debugging if ID is missing or undefined
        if (!data.id) {
            console.warn('[Flight Mapping] Flight ID is missing for flight:', data.flight_number);
        }

        return {
            id: data.id ? String(data.id) : 'N/A',
            flightNumber: data.flight_number || 'N/A',
            airline: data.aircraft?.manufacturer ?? 'Unknown Airline',
            origin: departureAirport?.code ?? '',
            destination: arrivalAirport?.code ?? '',
            departureTime,
            arrivalTime,
            duration,
            price: data.base_price ? Number(data.base_price) : 0,
            availableSeats: data.aircraft?.capacity_economy ?? 0,
            class: 'economy'
        };
    }

    async searchFlights(params: any) {
        const from = params.from ?? params.origin;
        const to = params.to ?? params.destination;
        const date = params.date ?? params.departureDate;
        const minPrice = params.minPrice;
        const maxPrice = params.maxPrice;

        const whereClause: any = {
            status: 'scheduled'
        };

        if (minPrice && maxPrice) {
            whereClause.base_price = { [Op.between]: [minPrice, maxPrice] };
        } else if (minPrice) {
            whereClause.base_price = { [Op.gte]: minPrice };
        } else if (maxPrice) {
            whereClause.base_price = { [Op.lte]: maxPrice };
        }

        const includeOptions: any[] = [
            {
                model: Airport,
                as: 'departureAirport',
                where: from ? { code: from.toUpperCase() } : undefined,
                required: !!from
            },
            {
                model: Airport,
                as: 'arrivalAirport',
                where: to ? { code: to.toUpperCase() } : undefined,
                required: !!to
            },
            {
                model: Aircraft,
                as: 'aircraft'
            },
            {
                model: Schedule,
                as: 'schedules',
                where: date ? {
                    departure_time: {
                        [Op.gte]: new Date(date),
                        [Op.lt]: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
                    }
                } : undefined,
                required: !!date 
            }
        ];

        const flightsList = await Flight.findAll({
            where: whereClause,
            include: includeOptions,
            order: [['base_price', 'ASC']]
        });

        const mappedFlights = flightsList.map((flight: any) => this.mapFlightToDto(flight));
        return {
            flights: mappedFlights,
            total: mappedFlights.length
        };
    }

    async getFlightById(id: number) {
        const flight = await Flight.findByPk(id, {
            include: [
                { model: Airport, as: 'departureAirport' },
                { model: Airport, as: 'arrivalAirport' },
                { model: Aircraft, as: 'aircraft' },
                { model: Schedule, as: 'schedules' }
            ]
        });

        if (!flight) {
            return null;
        }

        return this.mapFlightToDto(flight);
    }

    async createFlight(data: any) {
        return await Flight.create(data);
    }

    async getAllAirports() {
        return await Airport.findAll();
    }
}
