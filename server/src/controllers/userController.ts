import { Request, Response } from "express";
import { User } from "../model/user";

export const createUser = async (req: Request, res: Response) => {
    // Must be signed in via Google to create an account
    if (!req.isAuthenticated()) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }

    const profile = req.user as any;
    const googleUid: string = profile.id;
    const email: string = profile.emails?.[0]?.value;

    if (!email) {
        res.status(400).json({ message: "Could not retrieve email from Google account" });
        return;
    }

    // Prevent creating a duplicate account for an already-registered Google user
    const existing = await User.findOne({ googleUid });
    if (existing) {
        res.status(409).json({ message: "Account already exists for this Google user" });
        return;
    }

    const {
        firstName,
        lastName,
        mobileNumber,
        pronouns,
        university,
        studentId,
        upi,
        yearOfStudy,
        faculties,
    } = req.body;

    const missingFields = [];
    if (!firstName) missingFields.push("firstName");
    if (!lastName) missingFields.push("lastName");
    if (!mobileNumber) missingFields.push("mobileNumber");
    if (!university) missingFields.push("university");
    if (!studentId) missingFields.push("studentId");
    if (!upi) missingFields.push("upi");
    if (!yearOfStudy) missingFields.push("yearOfStudy");
    if (!faculties || !Array.isArray(faculties) || faculties.length === 0) {
        missingFields.push("faculties");
    }

    if (missingFields.length > 0) {
        res.status(400).json({
            message: "Missing required fields",
            fields: missingFields,
        });
        return;
    }

    try {
        const newUser = await User.create({
            googleUid,
            email,
            firstName,
            lastName,
            mobileNumber,
            pronouns,
            university,
            studentId,
            upi,
            yearOfStudy: Number(yearOfStudy),
            faculties,
            // createdAt / updatedAt handled automatically by { timestamps: true }
        });

        res.status(201).json(newUser);
    } catch (err: any) {
        // Handle duplicate key violations (studentId or upi already taken)
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyPattern || {})[0];
            res.status(409).json({
                message: `An account with this ${duplicateField} already exists`,
            });
            return;
        }
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};