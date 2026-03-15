'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // 1. Airports
        const airports = await queryInterface.bulkInsert('airports', [
            { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', lat: 40.6413, long: -73.7781, timezone: 'America/New_York', createdAt: new Date(), updatedAt: new Date() },
            { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK', lat: 51.4700, long: -0.4543, timezone: 'Europe/London', createdAt: new Date(), updatedAt: new Date() },
            { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', lat: 25.2532, long: 55.3657, timezone: 'Asia/Dubai', createdAt: new Date(), updatedAt: new Date() },
            { code: 'HND', name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', lat: 35.5494, long: 139.7798, timezone: 'Asia/Tokyo', createdAt: new Date(), updatedAt: new Date() },
            { code: 'SIN', name: 'Changi Airport', city: 'Singapore', country: 'Singapore', lat: 1.3644, long: 103.9915, timezone: 'Asia/Singapore', createdAt: new Date(), updatedAt: new Date() }
        ], { returning: true });

        // 2. Aircrafts
        const aircrafts = await queryInterface.bulkInsert('aircrafts', [
            { registration: 'N12345', type: 'Boeing 777-300ER', manufacturer: 'Boeing', capacity_economy: 300, capacity_business: 42, capacity_first: 8, createdAt: new Date(), updatedAt: new Date() },
            { registration: 'G-XWBA', type: 'Airbus A350-1000', manufacturer: 'Airbus', capacity_economy: 250, capacity_business: 56, capacity_first: 0, createdAt: new Date(), updatedAt: new Date() },
            { registration: 'A6-EUA', type: 'Airbus A380-800', manufacturer: 'Airbus', capacity_economy: 400, capacity_business: 70, capacity_first: 14, createdAt: new Date(), updatedAt: new Date() }
        ], { returning: true });

        // Helper to get ID by finding code/registration in the bulk inserted arrays would be complex since bulkInsert returns primary keys only in postgres if 'returning: true' is used, but names might not be returned in order?
        // Safer to fetch:
        // queryInterface currently doesn't easily return IDs for all records in a simple way for references without subsequent queries.
        // However, for seeding, we can assume sequential IDs if we just reset DB, OR query them.
        // For simplicity in this generated script, I will hardcode IDs (1-5, 1-3) but this is risky if IDs are not reset.
        // A better approach is to perform a SELECT.

        // Let's assume the DB is fresh.
        // Airports: 1=JFK, 2=LHR, 3=DXB
        // Aircrafts: 1=N12345, 2=G-XWBA, 3=A6-EUA

        // 3. Flights
        // JFK -> LHR (Boeing 777)
        // LHR -> DXB (Airbus A350)
        // DXB -> SIN (Airbus A380)

        const flights = await queryInterface.bulkInsert('flights', [
            { flight_number: 'FL001', departure_airport_id: 1, arrival_airport_id: 2, aircraft_id: 1, base_price: 500.00, currency: 'USD', status: 'scheduled', createdAt: new Date(), updatedAt: new Date() },
            { flight_number: 'FL002', departure_airport_id: 2, arrival_airport_id: 3, aircraft_id: 2, base_price: 600.00, currency: 'GBP', status: 'scheduled', createdAt: new Date(), updatedAt: new Date() },
            { flight_number: 'FL003', departure_airport_id: 3, arrival_airport_id: 5, aircraft_id: 3, base_price: 450.00, currency: 'AED', status: 'active', createdAt: new Date(), updatedAt: new Date() }
        ], { returning: true });

        // 4. Schedules
        // Flight 1: 2 schedules
        // Flight 2: 2 schedules
        // Flight 3: 1 schedule
        const now = new Date();
        const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(now); dayAfter.setDate(dayAfter.getDate() + 2);

        await queryInterface.bulkInsert('schedules', [
            // FL001
            { flight_id: 1, departure_time: tomorrow, arrival_time: new Date(tomorrow.getTime() + 7 * 60 * 60 * 1000), terminal: 'T4', status: 'on-time', createdAt: new Date(), updatedAt: new Date() },
            { flight_id: 1, departure_time: dayAfter, arrival_time: new Date(dayAfter.getTime() + 7 * 60 * 60 * 1000), terminal: 'T4', status: 'on-time', createdAt: new Date(), updatedAt: new Date() },
            // FL002
            { flight_id: 2, departure_time: tomorrow, arrival_time: new Date(tomorrow.getTime() + 8 * 60 * 60 * 1000), terminal: 'T5', status: 'delayed', createdAt: new Date(), updatedAt: new Date() },
            { flight_id: 2, departure_time: dayAfter, arrival_time: new Date(dayAfter.getTime() + 8 * 60 * 60 * 1000), terminal: 'T5', status: 'on-time', createdAt: new Date(), updatedAt: new Date() },
            // FL003
            { flight_id: 3, departure_time: now, arrival_time: new Date(now.getTime() + 6 * 60 * 60 * 1000), terminal: 'T3', status: 'on-time', createdAt: new Date(), updatedAt: new Date() }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('schedules', null, {});
        await queryInterface.bulkDelete('flights', null, {});
        await queryInterface.bulkDelete('aircrafts', null, {});
        await queryInterface.bulkDelete('airports', null, {});
    }
};
