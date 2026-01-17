import { Op } from 'sequelize';
import { Flight, Airport, Aircraft, Schedule } from '../models/index.js';

export class FlightService {

    async searchFlights(params: any) {
        const { from, to, date, minPrice, maxPrice } = params;

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

        // Filter by Airports
        if (from || to) {
            // This is slightly complex because relations are on ID, but search is usually by Code being passed or ID.
            // Assuming headers logic or lookup happens before, OR we include checking the included model.
            // Easiest is to filter inside the 'include' but Sequelize filtering on included models with 'required: true' performs an inner join.
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
                required: !!date // If date is provided, we only want flights having schedules on that date
            }
        ];

        return await Flight.findAll({
            where: whereClause,
            include: includeOptions,
            order: [
                ['base_price', 'ASC']
            ]
        });
    }

    async getFlightById(id: number) {
        return await Flight.findByPk(id, {
            include: [
                { model: Airport, as: 'departureAirport' },
                { model: Airport, as: 'arrivalAirport' },
                { model: Aircraft, as: 'aircraft' },
                { model: Schedule, as: 'schedules' }
            ]
        });
    }

    async createFlight(data: any) {
        return await Flight.create(data);
    }

    async getAllAirports() {
        return await Airport.findAll();
    }
}
