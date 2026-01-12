import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import { BookingController } from "./controllers/booking.controller.js";
import { connectRedis } from "./infra/redis/client.js";
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

(async function () {
  await connectDB();
})();

await connectRedis();

const bookingCtrl = new BookingController();

app.get("/health", (_req, res) => {
  res.json({ status: "OK", service: "booking-service (TypeScript + ESM)" });
});

app.post("/create", bookingCtrl.create);
app.get("/refrence/:ref", bookingCtrl.getByRef);
app.post("confirm/:ref", bookingCtrl.confirm);
app.get("/mybookings", bookingCtrl.getMyBookings);
app.patch("/:ref/seats", bookingCtrl.updateSeats);

// POST/api/bookings/create               Receive all data → create pending booking
// POST/api/bookings/:ref/confirm         After payment success → mark as confirmed
// GET/api/bookings/:ref                  Retrieve full booking (for confirmation page)
// GET/api/bookings/user/:userId          Get all bookings for logged-in user
// PATCH/api/bookings/:ref/seats          Update seat selection
// PATCH/api/bookings/:ref/baggage        Update extra baggage
// POST/api/bookings/:ref/cancelCancel    booking (if allowed)

async function start() {
  await connectDB();
  app.listen(4003, () => {
    console.log("Booking Service running on port 4003");
  });
}

start();
