import mongoose from "mongoose";

const { model } = mongoose;

const ticketSchema = new mongoose.Schema(
  {
    userID: { type: String, default: null },
    eventID: { type: String, default: null },
    paymentID: { type: String, default: null },
    groupBuddy: { type: String },
    dietaryRequirements: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Ticket = model("Ticket", ticketSchema);
