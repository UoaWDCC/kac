import mongoose from "mongoose";

const { model } = mongoose;

const ticketSchema = new mongoose.Schema(
  {
    userID: { type: String, default: "N/A" },
    eventID: { type: String, default: "N/A" },
    paymentID: { type: String, default: "N/A" },
    groupBuddy: { type: String, default: "N/A" },
    dietaryRequirements: { type: String, default: "N/A" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Ticket = model("Ticket", ticketSchema);
