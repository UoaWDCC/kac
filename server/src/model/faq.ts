import mongoose from "mongoose";
const { Schema, model } = mongoose;

const faqSchema = new Schema(
  {
    content: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export const Faq = model("Faq", faqSchema);
