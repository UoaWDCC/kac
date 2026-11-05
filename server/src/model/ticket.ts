import mongoose from "mongoose";

const { model } = mongoose;

const ticketSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    paymentID: {
      type: String,
      default: "N/A",
    },
    status: {
      type: String,
      enum: ["confirmed", "waitlisted", "cancelled"],
      default: "confirmed",
    },
    registeredAt: { type: Date, default: Date.now },
    waitlistedAt: { type: Date, default: null },
    attended: { type: Boolean, default: false },
    cancelledAt: { type: Date, default: null },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    groupBuddy: { type: String, default: "N/A" },
    dietaryRequirements: { type: String, default: "N/A" },
  },
  {
    timestamps: true,
    versionKey: false,
    autoIndex: false,
  }
);

// External compound index declaration for unique constraint on eventID and userID
ticketSchema.index({ eventID: 1, userID: 1 }, { unique: true });
ticketSchema.index({
  eventID: 1,
  status: 1,
  waitlistedAt: 1,
  _id: 1,
});

export const Ticket = model("Ticket", ticketSchema);
