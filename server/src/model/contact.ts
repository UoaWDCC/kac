import mongoose from "mongoose";

const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

export const Contact = model("Contact", contactSchema);
