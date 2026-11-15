import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Single-document collection: the membership price is shared by every checkout.
export const MEMBERSHIP_PRICE_ID = "membership";

const membershipPriceSchema = new Schema(
  {
    _id: { type: String, required: true },
    amountCents: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: (amount: number) => Number.isSafeInteger(amount),
        message: "Membership price must be a whole number of cents.",
      },
    },
  },
  { versionKey: false, timestamps: true }
);

export const MembershipPrice = model("MembershipPrice", membershipPriceSchema);
