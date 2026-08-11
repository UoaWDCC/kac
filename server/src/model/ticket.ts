import mongoose from "mongoose";

const { model } = mongoose;

const ticketSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    eventID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      default: null,
    },
    paymentID: {
      type: String,
      default: "N/A",
    },
    groupBuddy: { type: String, default: "N/A" },
    dietaryRequirements: { type: String, default: "N/A" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Ticket = model("Ticket", ticketSchema);
