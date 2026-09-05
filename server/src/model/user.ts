import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    googleUid: { type: String, required: true, unique: true },
    isAdmin: { type: Boolean, default: false },
    latestMembershipYear: { type: Number, default: null },
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    pronouns: { type: String, required: false },
    university: { type: String, required: false },
    studentId: { type: String, required: false },
    upi: { type: String, required: false },
    yearOfStudy: { type: Number, required: false, min: 1 },
    faculties: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model("User", userSchema);
