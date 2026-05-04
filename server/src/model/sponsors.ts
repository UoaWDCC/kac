import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tier: { type: String, enum: ["gold", "silver", "bronze"], required: true },
    logoUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export const Sponsor = mongoose.model("Sponsor", sponsorSchema);
