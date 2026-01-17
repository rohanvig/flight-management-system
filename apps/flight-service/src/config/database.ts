import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
    process.env.POSTGRES_DB || 'flight_db',
    process.env.POSTGRES_USER || 'booking_user',
    process.env.POSTGRES_PASSWORD || "strongpassword",
    {
        host: process.env.POSTGRES_HOST || 'localhost',
        dialect: 'postgres',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        logging: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

export default sequelize;
