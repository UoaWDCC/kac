import { RequestHandler } from "express";
import { User } from "../model/user";
import { getMembershipYear } from "../util/date";
import { signPassToken, verifyPassToken } from "../util/pass";

export const generatePassQR: RequestHandler = async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  const profile = req.user as any;
  const googleUid: string = profile.id;

  const user = await User.findOne({ googleUid });

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (user.latestMembershipYear !== getMembershipYear()) {
    res.status(403).json({ message: "No active membership for current year" });
    return;
  }

  const token = signPassToken(googleUid, user.latestMembershipYear!);
  const url = `${process.env.CLIENT_URL}/verify/${token}`;

  res.status(200).json({ url });
};

export const verifyPassQR: RequestHandler = async (req, res) => {
  const tokenParam = req.params.token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  if (!token) {
    res.status(400).json({ message: "Token is required" });
    return;
  }

  let payload;
  try {
    payload = verifyPassToken(token);
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired pass" });
    return;
  }

  const user = await User.findOne({ googleUid: payload.googleUid });

  if (!user) {
    res.status(404).json({ message: "Member not found" });
    return;
  }

  if (user.latestMembershipYear !== payload.membershipYear) {
    res.status(401).json({ message: "No active membership for current year" });
    return;
  }

  res.status(200).json({
    valid: true,
    firstName: user.firstName,
    lastName: user.lastName,
    membershipYear: user.latestMembershipYear,
  });
};
