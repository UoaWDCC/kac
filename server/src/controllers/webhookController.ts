// This controller is specifically for handling Stripe webhook events.
// It is not a general-purpose webhook controller.
import Stripe from "stripe";
import { RequestHandler } from "express";
import { Payment } from "../model/payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Must receive the raw request body, do not apply express.json() to this route.
export const handleWebhook: RequestHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    res.status(400).json({ message: "Missing Stripe signature header." });
    return;
  }

  let event: Stripe.Event;

  try {
    // Verify the event came from stripe using the raw body + webhook secret
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    res.status(400).json({ message: "Webhook signature verification failed." });
    return;
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  // Only updates Payment record if status is "pending",
  // to avoid overwriting a succeeded status from userController's update.
  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const { type } = paymentIntent.metadata;

        if (type === "membership") {
          await Payment.findOneAndUpdate(
            { stripePaymentIntentId: paymentIntent.id, status: "pending" },
            {
              status: "succeeded",
              paidAt: new Date(),
            }
          );
          console.log(
            `Membership payment succeeded for paymentIntentId ${paymentIntent.id}`
          );
        } else if (type === "event_ticket") {
          // TODO: event ticket handling when Event/Ticket model exists
          console.log(
            `Event ticket payment received: ${paymentIntent.id} (handler pending)`
          );
        } else {
          console.warn(
            `Webhook: Unrecognised payment type "${type}" for paymentIntentId ${paymentIntent.id}`
          );
        }
        break;
      }

      case "payment_intent.payment_failed": {
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id, status: "pending" },
          { status: "failed" }
        );
        console.log(`Payment failed for paymentIntentId ${paymentIntent.id}`);
        break;
      }

      case "payment_intent.canceled": {
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id, status: "pending" },
          { status: "failed" }
        );
        console.log(
          `Payment Intent cancelled/expired for paymentIntentId ${paymentIntent.id}`
        );
        break;
      }

      default:
        // All other Stripe events are acknowledged but not acted on
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook handling failed:", error);
    res.status(500).json({ message: "Webhook handling failed." });
  }
};
