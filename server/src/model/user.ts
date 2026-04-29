import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        googleUid: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        mobileNumber: { type: String, required: true },
        pronouns: { type: String, required: false },
        university: { type: String, required: true },
        studentId: { type: String, required: true, unique: true },
        upi: { type: String, required: true, unique: true },
        yearOfStudy: { type: Number, required: true, min: 1 },
        faculties: {
            type: [String], required: true, validate: {
                validator: (v: string[]) => v.length >= 1,
                message: "At least one faculty is required",
            }
        },
    },
    { timestamps: true, versionKey: false }
);

export const User = model("User", userSchema);