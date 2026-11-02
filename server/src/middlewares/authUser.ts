import { Request, Response, NextFunction } from "express";
import { User } from "../model/user";
import { Types } from "mongoose";

export interface AuthenticatedRequest extends Request {
  userID?: Types.ObjectId;
}

export async function requireUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not Authenticated." });
  }

  try {
    const profile = req.user as any;
    const user = await User.findOne({ googleUid: profile.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.userID = user._id;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}
