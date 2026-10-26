import Stripe from "stripe";
import { RequestHandler } from "express";
import { Payment } from "../model/payment";
import { Event } from "../model/event";
import { Ticket } from "../model/ticket";
import { User } from "../model/user";
import { EventPaymentError, getEventTicketAmount } from "../util/eventPayment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Body: { type: "membership" | "event_ticket", eventId?: string }
export const createPaymentIntent: RequestHandler = async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "not authenticated" });
    return;
  }

  const profile = req.user as any;
  const googleUid: string = profile.id;

  const { type, eventId } = req.body ?? {};
  if (type !== "membership" && type !== "event_ticket") {
    res
      .status(400)
      .json({ message: 'type must be "membership" or "event_ticket".' });
    return;
  }

  try {
    let amount = 500;
    let userId = null;
    let idempotencyKey: string | undefined;
    const metadata: Record<string, string> = { type, googleUid };

    if (type === "event_ticket") {
      if (typeof eventId !== "string" || !/^[a-f\d]{24}$/i.test(eventId)) {
        throw new EventPaymentError(400, "Invalid event ID.");
      }
      const event = await Event.findById(eventId);
      const user = await User.findOne({ googleUid });
      if (!event || !user) {
        throw new EventPaymentError(404, "Event or member not found.");
      }
      const now = new Date();
      if (
        event.datetime <= now ||
        (event.releaseDatetime && event.releaseDatetime > now)
      ) {
        throw new EventPaymentError(
          409,
          "Signups are not open for this event."
        );
      }
      const existing = await Ticket.findOne({
        eventID: event._id,
        userID: user._id,
      });
      if (existing && existing.status !== "cancelled") {
        throw new EventPaymentError(
          409,
          "You are already registered for this event."
        );
      }
      amount = getEventTicketAmount(event.price);
      if (amount === 0) {
        throw new EventPaymentError(
          400,
          "This event does not require payment."
        );
      }
      userId = user._id;
      metadata.eventId = event._id.toString();
      // One intent per registration attempt, including retries after a page refresh.
      idempotencyKey = `event-ticket:${event._id}:${user._id}:${existing?.updatedAt?.getTime() ?? "new"}:${amount}`;
    }

    const unusedPayment =
      type === "event_ticket"
        ? await Payment.findOne({
            googleUid,
            eventId: metadata.eventId,
            type,
            amount,
            ticketId: null,
          }).sort({ createdAt: -1 })
        : null;
    const previousIntent = unusedPayment
      ? await stripe.paymentIntents.retrieve(
          unusedPayment.stripePaymentIntentId
        )
      : null;
    const createdIntent =
      previousIntent && previousIntent.status !== "canceled"
        ? previousIntent
        : await stripe.paymentIntents.create(
            {
              amount,
              currency: "nzd",
              payment_method_types: ["card"],
              metadata,
            },
            idempotencyKey
              ? {
                  idempotencyKey: `${idempotencyKey}:${previousIntent?.id ?? "initial"}`,
                }
              : undefined
          );
    const paymentIntent =
      type === "event_ticket"
        ? await stripe.paymentIntents.retrieve(createdIntent.id)
        : createdIntent;

    try {
      await Payment.findOneAndUpdate(
        { stripePaymentIntentId: paymentIntent.id },
        {
          $setOnInsert: {
            stripePaymentIntentId: paymentIntent.id,
            googleUid,
            userId,
            eventId: type === "event_ticket" ? metadata.eventId : null,
            type,
            amount,
            currency: paymentIntent.currency,
            status: "pending",
            paidAt: null,
          },
        },
        { upsert: true, runValidators: true }
      );
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

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
    });
  } catch (error) {
    if (error instanceof EventPaymentError) {
      res.status(error.status).json({ message: error.message });
      return;
    }
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Failed to create payment intent." });
  }
};
