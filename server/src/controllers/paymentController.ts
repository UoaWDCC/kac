import Stripe from "stripe";
import { RequestHandler } from "express";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Body: { amount: number, type: "membership" | "event_ticket" }
export const createPaymentIntent: RequestHandler = async (req, res) => {
  const { amount, type } = req.body;

  if (!amount || !type) {
    res.status(400).json({ message: "amount and type are required." });
    return;
  }

  if (type !== "membership" && type !== "event_ticket") {
    res
      .status(400)
      .json({ message: 'type must be "membership" or "event_ticket".' });
    return;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents, e.g. 500 = $5.00
      currency: "nzd",
      metadata: { type },
    });

    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    res.status(500).json({ message: "Failed to create payment intent.", err });
  }
};
