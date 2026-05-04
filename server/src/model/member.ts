import mongoose from "mongoose";

const { Schema, model } = mongoose;

// temp member schema for testing/development purposes - will be replaced with an existing member schema once merged into main branch
const memberSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    university: { type: String, required: true },
    // Payment fields
    membershipPaid: { type: Boolean, default: false },
    stripePaymentIntentId: { type: String, default: null },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

export const Member = model("Member", memberSchema);
