import express from "express";
import passport from "passport";
import { User } from "../model/user";

const router = express.Router();

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
// Does a live DB lookup so hasAccount is always accurate —
// prevents the back-button bug where a mid-signup user appears logged in.
router.get("/me", async (req, res) => {
  if (!req.isAuthenticated()) {
    res.status(401).json(null);
    return;
  }

  const profile = req.user as any;
  const existingUser = await User.findOne({ googleUid: profile.id });
  profile.hasAccount = !!existingUser;

  res.json(profile);
});

export default router;