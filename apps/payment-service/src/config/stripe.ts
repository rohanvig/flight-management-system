import { config } from "dotenv";
config();

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.error("FATAL: STRIPE_SECRET_KEY not found! Check .env file");
  process.exit(1);
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});
