import mongoose from "mongoose";
import { getEventTicketAmount } from "../util/eventPayment";

const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    datetime: { type: Date, required: true },
    price: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: (price: number) => {
          try {
            getEventTicketAmount(price);
            return true;
          } catch {
            return false;
          }
        },
        message: "Price must be a valid NZD amount with at most two decimals.",
      },
    },
    capacity: {
      type: Number,
      required: false,
      min: [1, "Capacity must be at least 1."],
      validate: {
        validator: Number.isInteger,
        message: "Capacity must be a whole number.",
      },
    },
    registrationVersion: { type: Number, default: 0 },
    releaseDatetime: { type: Date, required: false }, // if unset, event is released immediately
  },
  { versionKey: false }
);

export const Event = model("Event", eventSchema);
