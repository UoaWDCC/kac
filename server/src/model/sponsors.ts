import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["cbd", "newmarket", "other"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Sponsor = mongoose.model("Sponsor", sponsorSchema);
