// src/controllers/booking.controller.ts
import type { Request, Response } from "express";
import { bookingService } from "../services/booking.service.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export class BookingController {
  create = async (req: Request, res: Response) => {
    try {
      const booking = await bookingService.create(req.body, req.user?.userId);
      res.status(201).json({ booking });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  };

  confirm = async (req: Request, res: Response) => {
    const { ref } = req.params;
    const { paymentIntentId } = req.body;
    const booking = await bookingService.confirm(ref, paymentIntentId);
    if (!booking)
      return res.status(400).json({ message: "Invalid or expired booking" });
    res.json({ message: "Booking confirmed!", booking });
  };

  getByRef = async (req: Request, res: Response) => {
    const booking = await bookingService.findByRef(req.params.ref);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  };

  getMyBookings = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role?: string;
    };
    req.user = decoded;
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const bookings = await bookingService.findUserBookings(req.user.userId);
    res.json(bookings);
  };

  updateSeats = async (req: Request, res: Response) => {
    const booking = await bookingService.updateSeats(
      req.params.ref,
      req.body.seats
    );
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Seats updated", booking });
  };
}
