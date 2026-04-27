import mongoose from "mongoose";
cost { Schema, model } = mongoose;

const faqSchema = new Schema(
    {
        question: { type: String, required: true}
        answer: { type: String, required: true}
    },
    { versionkey: false}
);

export const Faq = model("Faq", faqSchema)