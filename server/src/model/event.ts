import mongoose from "mongoose";

const { Schema, model } = mongoose;

const eventSchema = new Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  location: { type: String, required: true },
  datetime: { type: Date, required: true },
  status: { type: String, default: null },
});

export const Event = model("Event", eventSchema);
