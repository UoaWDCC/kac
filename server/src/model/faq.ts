import mongoose from "mongoose";
const { Schema, model } = mongoose;

const faqSchema = new Schema(
    {
        question: { type: String, required: true},
        answer: { type: String, required: true}
    },
    { versionKey: false}
);

export const Faq = model("Faq", faqSchema)