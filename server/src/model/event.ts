import mongoose from "mongoose";

const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    datetime: { type: Date, required: true },
    capacity: { type: Number, required: false },
    releaseDatetime: { type: Date, required: false }, // if unset, event is released immediately
  },
  { versionKey: false }
);

export const Event = model("Event", eventSchema);
