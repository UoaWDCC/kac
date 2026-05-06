import Stripe from "stripe";
import { RequestHandler } from "express";
import { Member } from "../model/member";

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

  // Handle relevant stripe events
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { type } = paymentIntent.metadata;

    try {
      if (type === "membership") {
        await handleMembershipPayment(paymentIntent);
      } else if (type === "event_ticket") {
        // TODO: Ticket handling for when event/ticket model exists
        console.log(
          `Event ticket payment received: ${paymentIntent.id} (handler pending)`
        );
      }
    } catch (err) {
      // Error is on our side, return 200 so stripe doesn't retry
      console.error("Error processing webhook event:", err);
    }
  }

  res.status(200).json({ received: true });
};

async function handleMembershipPayment(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const member = await Member.findOneAndUpdate(
    { stripePaymentIntentId: paymentIntent.id },
    {
      membershipPaid: true,
      paidAt: new Date(),
    },
    { new: true }
  );

  console.log(`Membership payment confirmed for member: ${member?.email}`);
}
