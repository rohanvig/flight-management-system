import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

export class Airport extends Model {
    public id!: number;
    public code!: string;
    public name!: string;
    public city!: string;
    public country!: string;
    public lat!: number;
    public long!: number;
    public timezone!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Airport.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING(3),
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 3],
                isUppercase: true
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        long: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'airports',
    }
);
