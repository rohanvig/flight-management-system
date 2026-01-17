import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import flightRoutes from './routes/flight.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4004;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'flight-service' });
});

app.use('/api/flights', flightRoutes);

// Start server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Flight Service running on port ${PORT}`);
    });
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
});
