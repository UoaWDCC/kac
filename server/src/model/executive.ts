import mongoose from "mongoose";

const { Schema, model } = mongoose;

const executiveSchema = new Schema(
  {
    imageURL: { type: String, required: true },
    displayName: { type: String, required: true },
    execRole: { type: String, required: true },
    roleGroup: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

export const Executive = model("Executive", executiveSchema);
