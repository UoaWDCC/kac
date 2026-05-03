import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import authRoutes from "./routes/authRoutes";
import imageRoutes from "./routes/imageRoutes";
import executivesRoutes from "./routes/executivesRoutes";
import faqRoutes from "./routes/faqRoutes";
// app config
dotenv.config({ quiet: true });

const port: number = Number(process.env.PORT) || 3000;
const app: express.Application = express();
const mongoUrl: string = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@kac-prod.cf1fyh5.mongodb.net/`;

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: "/api/auth/google/callback",
    },
    (_accessToken, _refreshToken, profile, done) => {
      // For future DB storage of user info
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: Express.User, done) => done(null, user));

// middleware
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/executives", executivesRoutes);
app.use("/api/faqs", faqRoutes);

// Connect to MongoDB and start the server
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server application listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
