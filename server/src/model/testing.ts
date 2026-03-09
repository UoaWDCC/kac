import mongoose from "mongoose";
const { Schema, model } = mongoose;

const testingSchema = new Schema({
  name: String,
  value: Number,
});

export const Testing = model("Testing", testingSchema);
