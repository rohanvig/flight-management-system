import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export class Aircraft extends Model {
    public id!: number;
    public registration!: string;
    public type!: string;
    public manufacturer!: string;
    public capacity_economy!: number;
    public capacity_business!: number;
    public capacity_first!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Aircraft.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        registration: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        manufacturer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        capacity_economy: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        capacity_business: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        capacity_first: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        tableName: 'aircrafts',
    }
);
