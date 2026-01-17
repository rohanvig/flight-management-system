import { Router } from 'express';
import { FlightController } from '../controllers/flight.controller.js';

const router = Router();
const flightController = new FlightController();

router.get('/search', (req, res) => flightController.search(req, res));
router.get('/airports', (req, res) => flightController.getAirports(req, res));
router.get('/:id', (req, res) => flightController.getById(req, res));

export default router;
