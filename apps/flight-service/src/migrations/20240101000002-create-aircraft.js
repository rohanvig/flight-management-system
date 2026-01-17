'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('aircrafts', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            registration: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            manufacturer: {
                type: Sequelize.STRING,
                allowNull: false
            },
            capacity_economy: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            capacity_business: {
                type: Sequelize.INTEGER,
                defaultValue: 0
            },
            capacity_first: {
                type: Sequelize.INTEGER,
                defaultValue: 0
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
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('aircrafts');
    }
};
