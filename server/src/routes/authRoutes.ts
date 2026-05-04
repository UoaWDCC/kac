import express from "express";
import passport from "passport";

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

// Route to check if user is authenticated
router.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json(null);
  }
});

export default router;