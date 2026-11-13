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
        validator: (capacity: number | null) =>
          capacity == null || Number.isInteger(capacity),
        message: "Capacity must be a whole number.",
      },
    },
    registrationVersion: { type: Number, default: 0 },
    registrationRequired: { type: Boolean, default: true }, // false for events with no website sign-up
    groupBuddyEnabled: { type: Boolean, default: true },
    dietaryRequirementsEnabled: { type: Boolean, default: true },
    customQuestions: {
      type: [
        new Schema(
          {
            id: { type: String, required: true, maxlength: 100 },
            label: { type: String, required: true, trim: true, maxlength: 300 },
            enabled: { type: Boolean, default: true },
            required: { type: Boolean, default: false },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    releaseDatetime: { type: Date, required: false }, // if unset, event is released immediately
  },
  { versionKey: false }
);

export const Event = model("Event", eventSchema);
