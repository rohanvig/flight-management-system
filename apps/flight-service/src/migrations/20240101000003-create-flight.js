'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('flights', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            flight_number: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            departure_airport_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'airports',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            arrival_airport_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'airports',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            aircraft_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'aircrafts',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            base_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            currency: {
                type: Sequelize.STRING(3),
                defaultValue: 'USD'
            },
            status: {
                type: Sequelize.ENUM('scheduled', 'active', 'completed', 'cancelled'),
                defaultValue: 'scheduled'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        await queryInterface.addIndex('flights', ['flight_number'], { unique: true });
        await queryInterface.addIndex('flights', ['departure_airport_id']);
        await queryInterface.addIndex('flights', ['arrival_airport_id']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('flights');
    }
};
