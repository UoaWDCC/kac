import express from "express";
import passport from "passport";
import { User } from "../model/user";

const router = express.Router();

type Role = "guest" | "legacy" | "member" | "admin";

// December payments are counted to the next year since nothing happens in December.
const getMembershipYear = (): number => {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed, 11 = December
  const year = now.getFullYear();
  return month === 11 ? year + 1 : year;
};

const deriveRole = (existingUser: any): Role => {
  if (!existingUser) return "legacy";
  if (existingUser.isAdmin) return "admin";
  if (existingUser.latestMembershipYear === getMembershipYear())
    return "member";
  return "legacy";
};

// Google login route
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google redirects back here after login
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const profile = req.user as any;
    if (profile?.hasAccount) {
      res.redirect(process.env.CLIENT_URL!);
    } else {
      res.redirect(`${process.env.CLIENT_URL!}/signup`);
    }
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.CLIENT_URL!);
  });
});

// Route to check if user is authenticated.
// Does a live DB lookup so hasAccount and role are always accurate -
// prevents the back-button bug where a mid-signup user appears logged in.
router.get("/me", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.json({ role: "guest" });
    return;
  }

  const profile = req.user as any;
  const existingUser = await User.findOne({ googleUid: profile.id });

  profile.hasAccount = !!existingUser;
  profile.role = deriveRole(existingUser);

  res.json(profile);
});

export default router;
