import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import { StripeController } from "./controllers/stripe.controller.js";

const app = express();
app.use(cors());
app.use(express.json());

const stripeCtrl = new StripeController();

app.post("/create", stripeCtrl.createPaymentIntent);

app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeCtrl.handleWebhook
);

app.get("/", (_req, res) => {
  res.json({ status: "OK", service: "payment-service (INR + Webhook Fixed)" });
});

app.listen(4005, () => {
  console.log("Payment Service running on port 4005");
});
