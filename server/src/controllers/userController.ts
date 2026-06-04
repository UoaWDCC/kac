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

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAuthenticatedUser = async (req: Request) => {
  const profile = req.user as { id?: string } | undefined;

  if (!profile?.id) return null;

  return User.findOne({ googleUid: profile.id });
};

export const updateUser = async (req: Request, res: Response) => {
  const allowedFields = [
    "email",
    "firstName",
    "lastName",
    "mobileNumber",
    "pronouns",
    "university",
    "studentId",
    "upi",
    "yearOfStudy",
    "faculties",
    "latestMembershipYear",
    "isAdmin",
  ];

  const updates = allowedFields.reduce<Record<string, unknown>>(
    (acc, field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        acc[field] = req.body[field];
      }

      return acc;
    },
    {}
  );

  if (updates.yearOfStudy !== undefined) {
    updates.yearOfStudy = Number(updates.yearOfStudy);
  }

  if (updates.isAdmin !== undefined) {
    updates.isAdmin = updates.isAdmin === true || updates.isAdmin === "true";
  }

  if (updates.latestMembershipYear === "") {
    updates.latestMembershipYear = null;
  } else if (
    updates.latestMembershipYear !== undefined &&
    updates.latestMembershipYear !== null
  ) {
    updates.latestMembershipYear = Number(updates.latestMembershipYear);
  }

  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (updates.isAdmin === false && targetUser.isAdmin) {
      const currentUser = await getAuthenticatedUser(req);

      if (!currentUser) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      if (String(currentUser._id) === String(targetUser._id)) {
        res.status(400).json({
          message: "You cannot remove admin access from your own account",
        });
        return;
      }

      const adminCount = await User.countDocuments({ isAdmin: true });

      if (adminCount <= 1) {
        res.status(400).json({
          message: "At least one admin account must remain",
        });
        return;
      }
    }

    const user = await User.findByIdAndUpdate(targetUser._id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err: any) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern || {})[0];
      res.status(409).json({
        message: `An account with this ${duplicateField} already exists`,
      });
      return;
    }

    console.error("Error updating user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const currentUser = await getAuthenticatedUser(req);

    if (!currentUser) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    if (String(currentUser._id) === String(targetUser._id)) {
      res.status(400).json({
        message: "You cannot delete your own admin account",
      });
      return;
    }

    if (targetUser.isAdmin) {
      const adminCount = await User.countDocuments({ isAdmin: true });

      if (adminCount <= 1) {
        res.status(400).json({
          message: "At least one admin account must remain",
        });
        return;
      }
    }

    await targetUser.deleteOne();

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
