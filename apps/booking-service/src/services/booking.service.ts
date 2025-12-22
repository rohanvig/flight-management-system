import { Booking } from "../models/booking.model.js";
import type {
  BookingAttributes,
  BookingCreationAttributes,
} from "../models/booking.model.js";

export class BookingService {
  async create(data: Partial<BookingCreationAttributes>, userId?: string) {
    const booking = await Booking.create({
      ...data,
      userId,
    });

    return booking;
  }

  async confirm(bookingRef: string, paymentIntentId: string) {
    const [updatedCount] = await Booking.update(
      {
        status: "confirmed",
        paymentIntentId,
      },
      {
        where: {
          bookingReference: bookingRef,
          status: "pending",
        },
      }
    );

    if (updatedCount === 0) return null;

    return await Booking.findOne({
      where: { bookingReference: bookingRef },
    });
  }

  async findByRef(bookingRef: string) {
    return await Booking.findOne({
      where: { bookingReference: bookingRef },
    });
  }

  async findUserBookings(userId: string) {
    return await Booking.findAll({
      where: { userId },
      order: [["bookedAt", "DESC"]],
    });
  }

  async updateSeats(bookingRef: string, seats: Record<string, string>) {
    const [updatedCount] = await Booking.update(
      { selectedSeats: seats },
      {
        where: { bookingReference: bookingRef },
      }
    );

    if (updatedCount === 0) return null;

    return await Booking.findOne({
      where: { bookingReference: bookingRef },
    });
  }
}

export const bookingService = new BookingService();
