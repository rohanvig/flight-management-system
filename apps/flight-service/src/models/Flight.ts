import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { Airport } from './Airport.js';
import { Aircraft } from './Aircraft.js';

export class Flight extends Model {
    public id!: number;
    public flight_number!: string;
    public departure_airport_id!: number;
    public arrival_airport_id!: number;
    public aircraft_id!: number;
    public base_price!: number;
    public currency!: string;
    public status!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Flight.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        flight_number: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        departure_airport_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'airports',
                key: 'id'
            }
        },
        arrival_airport_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'airports',
                key: 'id'
            }
        },
        aircraft_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'aircrafts',
                key: 'id'
            }
        },
        base_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
        },
        status: {
            type: DataTypes.ENUM('scheduled', 'active', 'completed', 'cancelled'),
            defaultValue: 'scheduled',
        },
    },
    {
        sequelize,
        tableName: 'flights',
        indexes: [
            {
                fields: ['flight_number'],
                unique: true
            },
            {
                fields: ['departure_airport_id']
            },
            {
                fields: ['arrival_airport_id']
            }
        ]
    }
);
