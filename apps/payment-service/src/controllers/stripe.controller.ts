import type { Request, Response } from "express";
import { stripe } from "../config/stripe.js";

const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL!;

export class StripeController {
  // 1. Create PaymentIntent (call this after booking created)
  createPaymentIntent = async (req: Request, res: Response) => {
    const { bookingRef, amount, currency = "inr" } = req.body;

    if (!bookingRef || !amount) {
      return res.status(400).json({ error: "bookingRef and amount required" });
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // ← 664 → 66400 paise
        currency: currency.toLowerCase(),
        metadata: { bookingRef },
        automatic_payment_methods: { enabled: true },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  // 2. Handle Stripe Webhook (to confirm payment and update booking)
  handleWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as any;
      const bookingRef = paymentIntent.metadata.bookingRef;

      await fetch(`${BOOKING_SERVICE_URL}/api/bookings/confirm/${bookingRef}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
      });
    }

    res.json({ received: true });
  };
}
