import type Stripe from "stripe";

export class EventPaymentError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export function getEventTicketAmount(price: number | null | undefined): number {
  const value = price ?? 0;
  const cents = Math.round(value * 100);
  if (
    !Number.isFinite(value) ||
    value < 0 ||
    !Number.isSafeInteger(cents) ||
    Math.abs(value * 100 - cents) > 0.000001
  ) {
    throw new EventPaymentError(400, "Event price must be a valid NZD amount.");
  }
  return cents;
}

export function verifyEventTicketPayment(
  intent: Stripe.PaymentIntent,
  eventId: string,
  googleUid: string,
  amount: number
): void {
  if (
    intent.metadata.type !== "event_ticket" ||
    intent.metadata.eventId !== eventId
  ) {
    throw new EventPaymentError(400, "Payment is not for this event.");
  }
  if (intent.metadata.googleUid !== googleUid) {
    throw new EventPaymentError(403, "Payment does not belong to this user.");
  }
  if (intent.status !== "succeeded") {
    throw new EventPaymentError(402, "Payment has not been completed.");
  }
  if (
    intent.currency !== "nzd" ||
    intent.amount !== amount ||
    intent.amount_received !== amount
  ) {
    throw new EventPaymentError(
      400,
      "Payment amount does not match this event."
    );
  }
}
