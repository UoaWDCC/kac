import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Stores all payment transactions: membership and event tickets.
// stripePaymentIntentId acts as the unique identifier.
// googleUid is stored at creation time (before the User exists).
// userId is populated after the User is successfully created.
const paymentSchema = new Schema(
  {
    stripePaymentIntentId: { type: String, required: true, unique: true },
    googleUid: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", default: null },
    type: {
      type: String,
      required: true,
      enum: ["membership", "event_ticket"],
    },
    // TODO: when events are implemented, eventId will reference the specific event being purchased
    // eventId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Event",
    //   default: null,
    // },
    amount: { type: Number, required: true }, // in cents
    status: {
      type: String,
      required: true,
      enum: ["succeeded", "pending", "failed"],
      default: "pending",
    },
    paidAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Payment = model("Payment", paymentSchema);
