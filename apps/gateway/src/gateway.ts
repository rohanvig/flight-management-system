import express from "express";
import cors from "cors";
import morgan from "morgan";
import { createServiceProxy } from "./proxies/createProxy.js";
import { authenticate } from "./middleware/auth.middleware.js";
import { config } from "dotenv";
config();
const Booking_SERVICE_URL =
  process.env.BOOKING_SERVICE_URL! || "http://booking-service:4003";
const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL! || "http://payment-service:4005";
const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL! || "http://user-service:4001";
const FLIGHT_SERVICE_URL =
  process.env.FLIGHT_SERVICE_URL! || "http://flight-service:4004";
const app = express();

app.use(cors());
app.use(morgan("combined"));

app.use("/api/auth", createServiceProxy(USER_SERVICE_URL, "/api/auth"));
app.use(
  "/api/bookings",
  authenticate,
  createServiceProxy(Booking_SERVICE_URL, "/api/bookings")
);
app.use(
  "/api/payments",
  authenticate,
  createServiceProxy(PAYMENT_SERVICE_URL, "/api/payments")
);

app.use(
  "/api/flights",
  authenticate,
  createServiceProxy(FLIGHT_SERVICE_URL, "/api/flights")
);

app.get("/", (req, res) => {
  res.json({
    status: "Gateway is running",
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT}`);
});
