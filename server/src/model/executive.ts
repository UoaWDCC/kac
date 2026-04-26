import mongoose from "mongoose";

const { Schema, model } = mongoose;

const executiveSchema = new Schema(
  {
    imageURL: { type: String, required: true },
    displayName: { type: String, required: true },
    role: { type: String, required: true },
    description: { type: String, required: true },
    fullName: { type: String, required: true },
    ethnicity: { type: String, required: false },
    degree: { type: String, required: false },
    mbti: { type: String, required: true },
    fact: { type: String, required: true },
    sponsor: { type: String, required: true },
    greenFlag: { type: String, required: true },
    redFlag: { type: String, required: true },
    emojis: { type: String, required: false },
  },
  { timestamps: true }
);

export const Executive = model("Executive", executiveSchema);
