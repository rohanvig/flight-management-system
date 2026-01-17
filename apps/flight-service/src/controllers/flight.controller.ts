import { Request, Response } from 'express';
import { FlightService } from '../services/flight.service.js';

const flightService = new FlightService();

export class FlightController {

    async search(req: Request, res: Response) {
        try {
            const flights = await flightService.searchFlights(req.query);
            res.json(flights);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error searching flights' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid ID' });
            }
            const flight = await flightService.getFlightById(id);
            if (!flight) {
                return res.status(404).json({ message: 'Flight not found' });
            }
            res.json(flight);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving flight' });
        }
    }

    async getAirports(req: Request, res: Response) {
        try {
            const airports = await flightService.getAllAirports();
            res.json(airports);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving airports' });
        }
    }
}
