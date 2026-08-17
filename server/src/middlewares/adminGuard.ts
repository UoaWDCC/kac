import { Request, Response, NextFunction } from "express";
import { User } from "../model/user";

export const isAdminRequest = async (req: Request): Promise<boolean> => {
  if (!req.isAuthenticated()) return false;

  const profile = req.user as any;
  const user = await User.findOne({ googleUid: profile.id });

  return Boolean(user?.isAdmin);
};

export const adminGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  if (!(await isAdminRequest(req))) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  next();
};
