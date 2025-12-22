export interface Passenger {
  type: "adult" | "child" | "infant";
  title: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiry?: string;
  seatNumber?: string;
  baggage?: { carryOn: number; checked: number };
}

export interface Contact {
  email: string;
  phone: string;
  countryCode: string;
}

export interface FlightLeg {
  flightNumber: string;
  airline: string;
  airlineCode: string;
  departure: { airport: string; dateTime: string };
  arrival: { airport: string; dateTime: string };
  duration: string;
  stops: number;
  cabinClass: string;
}