import { Request, Response, NextFunction } from "express";
import { User } from "../model/user";

export const adminGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const profile = req.user as any;
  const user = await User.findOne({ googleUid: profile.id });

  if (!user?.isAdmin) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  next();
};
