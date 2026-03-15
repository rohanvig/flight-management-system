'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('schedules', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            flight_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'flights',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            departure_time: {
                type: Sequelize.DATE,
                allowNull: false
            },
            arrival_time: {
                type: Sequelize.DATE,
                allowNull: false
            },
            terminal: {
                type: Sequelize.STRING,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('on-time', 'delayed', 'cancelled'),
                defaultValue: 'on-time'
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

        await queryInterface.addIndex('schedules', ['flight_id']);
        await queryInterface.addIndex('schedules', ['departure_time']);
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('schedules');
    }
};
