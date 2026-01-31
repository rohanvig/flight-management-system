import { Booking } from "../models/booking.model.js";
import type {
  BookingAttributes,
  BookingCreationAttributes,
} from "../models/booking.model.js";
import { lockService } from "../infra/redis/lock.js";
export class BookingService {
  async create(data: Partial<BookingCreationAttributes>, userId?: string) {
    const seats = Object.keys(data.selectedSeats || {});

    const lockKeys = seats.map(
      (seat) =>
        `booking:lock:flight:${data.outbound?.flightNumber}:seat:${seat}`,
    );
    const acquiredLocks: string[] = [];

    for (const key of lockKeys) {
      const locked = await lockService.acquire(key);
      if (!locked) {
        for (const l of acquiredLocks) {
          await lockService.release(l);
        }
        throw new Error(`Seat ${key} is currently locked`);
      }
      acquiredLocks.push(key);
    }

    try {
      const booking = await Booking.create({
        ...data,
        userId,
      } as BookingCreationAttributes);
      return booking;
    } catch (error) {
      throw error;
    } finally {
      for (const key of acquiredLocks) {
        await lockService.release(key);
      }
    }
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
      },
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
      },
    );

    if (updatedCount === 0) return null;

    return await Booking.findOne({
      where: { bookingReference: bookingRef },
    });
  }
}

export const bookingService = new BookingService();
