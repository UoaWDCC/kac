import mongoose from "mongoose";

const { Schema, model } = mongoose;

// Assumed image schema design - can adjust based on client
const imageSchema = new Schema(
  {
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    s3Key: { type: String, required: true, unique: true },
    bucket: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  },
  { versionKey: false },
);

export const Image = model("Image", imageSchema);
