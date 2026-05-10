import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    deal: { type: String, required: true },
    address: { type: String, required: true },
    category: {
      type: String,
      enum: ["cbd", "newmarket", "other"],
      required: true,
    },
    code: { type: String }, // optional (only some sponsors have it)
  },
  { timestamps: true }
);

export const Sponsor = mongoose.model("Sponsor", sponsorSchema);
