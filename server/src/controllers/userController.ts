import { Request, Response } from "express";
import Stripe from "stripe";
import { User } from "../model/user";
import { Payment } from "../model/payment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
    res
      .status(400)
      .json({ message: "Could not retrieve email from Google account" });
    return;
  }

  // Prevent creating a duplicate account for an already-registered Google user
  const existing = await User.findOne({ googleUid });
  if (existing) {
    res
      .status(409)
      .json({ message: "Account already exists for this Google user" });
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
    paymentIntentId,
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
  if (!paymentIntentId || typeof paymentIntentId !== "string")
    missingFields.push("paymentIntentId");

  if (missingFields.length > 0) {
    res.status(400).json({
      message: "Missing required fields",
      fields: missingFields,
    });
    return;
  }

  // 1. Payment Intent Verification Steps:
  // Verify Payment Intent with Stripe
  let intent: Stripe.PaymentIntent;
  try {
    intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (err) {
    console.error("Error verifying payment intent:", err);
    res
      .status(400)
      .json({ message: "Could not verify payment. Please contact support." });
    return;
  }

  if (intent.status !== "succeeded") {
    res.status(402).json({ message: "Payment has not been completed." });
    return;
  }

  if (intent.metadata?.type !== "membership") {
    res.status(400).json({ message: "Invalid payment type for membership." });
    return;
  }

  // Verify Payment Intent belongs to the authenticated user
  if (intent.metadata?.googleUid !== googleUid) {
    res
      .status(403)
      .json({ message: "Payment Intent does not belong to this user." });
    return;
  }

  // 2. Existing Payment Record Verification Steps:
  const payment = await Payment.findOne({
    stripePaymentIntentId: paymentIntentId,
  });

  if (!payment) {
    res.status(404).json({
      message: "Payment record not found. Please contact support.",
    });
    return;
  }

  // Verify the payment record belongs to the user
  if (payment.googleUid !== googleUid) {
    res.status(403).json({
      message: "Payment record does not belong to this user.",
    });
    return;
  }

  if (payment.amount !== intent.amount) {
    res.status(400).json({
      message: "Payment amount mismatch.",
    });
    return;
  }

  if (payment.status === "failed") {
    res.status(402).json({
      message: "Payment failed. Please try again.",
    });
    return;
  }

  if (payment.userId) {
    res.status(409).json({
      message: "This payment has already been used to create an account.",
    });
    return;
  }

  if (payment.type !== "membership") {
    res.status(400).json({
      message: "Existing payment record is not for a membership.",
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

    // Verify the local payment record belongs to the authenticated Google user
    try {
      await Payment.findByIdAndUpdate(payment._id, {
        userId: newUser._id,
        status: "succeeded",
        paidAt: new Date(),
      });
    } catch (paymentUpdateErr) {
      // Payment Intent was successful and user account created, but failed to link the Payment record to the user.
      // The orphaned Payment record (succeeded status, no userId) will require admin reconciliation.
      console.error(
        `Failed to update Payment record ${payment._id} for user ${newUser._id}. ` +
          `Payment succeeded but userId not linked, requires admin reconciliation.`,
        paymentUpdateErr
      );
    }

    res.status(201).json(newUser);
  } catch (err: any) {
    // Handle duplicate key violations for fields that must be unique, such as email or googleUid
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
