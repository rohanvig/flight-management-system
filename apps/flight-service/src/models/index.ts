import { Airport } from './Airport.js';
import { Aircraft } from './Aircraft.js';
import { Flight } from './Flight.js';
import { Schedule } from './Schedule.js';

// Associations
Airport.hasMany(Flight, { foreignKey: 'departure_airport_id', as: 'departingFlights' });
Airport.hasMany(Flight, { foreignKey: 'arrival_airport_id', as: 'arrivingFlights' });

Flight.belongsTo(Airport, { foreignKey: 'departure_airport_id', as: 'departureAirport' });
Flight.belongsTo(Airport, { foreignKey: 'arrival_airport_id', as: 'arrivalAirport' });

Aircraft.hasMany(Flight, { foreignKey: 'aircraft_id', as: 'flights' });
Flight.belongsTo(Aircraft, { foreignKey: 'aircraft_id', as: 'aircraft' });

Flight.hasMany(Schedule, { foreignKey: 'flight_id', as: 'schedules' });
Schedule.belongsTo(Flight, { foreignKey: 'flight_id', as: 'flight' });

export {
    Airport,
    Aircraft,
    Flight,
    Schedule
};
