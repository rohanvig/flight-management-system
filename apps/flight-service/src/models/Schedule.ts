import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export class Schedule extends Model {
    public id!: number;
    public flight_id!: number;
    public departure_time!: Date;
    public arrival_time!: Date;
    public terminal!: string;
    public status!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Schedule.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        flight_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'flights',
                key: 'id'
            }
        },
        departure_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        arrival_time: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        terminal: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('on-time', 'delayed', 'cancelled'),
            defaultValue: 'on-time',
        },
    },
    {
        sequelize,
        tableName: 'schedules',
        indexes: [
            {
                fields: ['flight_id']
            },
            {
                fields: ['departure_time']
            }
        ]
    }
);
