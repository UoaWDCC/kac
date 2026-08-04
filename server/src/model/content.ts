import mongoose from "mongoose";
const { Schema, model } = mongoose;

const contentSchema = new Schema(
  {
    _id: { type: String, required: true },
    content: { type: String, required: true },
  },
  { versionKey: false, timestamps: true }
);

export const Content = model("Content", contentSchema);
