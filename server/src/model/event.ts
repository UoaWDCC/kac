import mongoose from "mongoose";

const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageURL: { type: String, required: true },
    location: { type: String, required: true },
    datetime: { type: Date, required: true },
  }
);

export const Event = model("Event", eventSchema);