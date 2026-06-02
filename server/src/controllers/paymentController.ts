import Stripe from "stripe";
import { RequestHandler } from "express";
import { Payment } from "../model/payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Body: { type: "membership" | "event_ticket" }
export const createPaymentIntent: RequestHandler = async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "not authenticated" });
    return;
  }

  const profile = req.user as any;
  const googleUid: string = profile.id;

  const { type } = req.body;

  if (!type) {
    res.status(400).json({ message: "type is required." });
    return;
  }

  const PRICES: Record<string, number> = {
    membership: 500, // hardcoded
  };
  const amount = PRICES[type];

  if (!amount) {
    res
      .status(400)
      .json({ message: 'type must be "membership" or "event_ticket".' });
    return;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents, e.g. 500 = $5.00
      currency: "nzd",
      metadata: { type, googleUid },
    });

    try {
      await Payment.create({
        stripePaymentIntentId: paymentIntent.id,
        googleUid,
        userId: null,
        type,
        amount,
        currency: paymentIntent.currency,
        status: "pending",
        paidAt: null,
      });
    } catch (dbError) {
      // PaymentIntent was created on Stripe but failed to record locally.
      // Since clientSecret is not returned, FE cannot complete payment through normal flow.
      console.error(
        `Failed to create Payment record for paymentIntentId ${paymentIntent.id}:`,
        dbError
      );
      res.status(500).json({
        message: "Failed to initialise payment record. Please try again.",
      });
      return;
    }

    res.status(201).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Failed to create payment intent." });
  }
};
