import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import authRoutes from "./routes/authRoutes";
import imageRoutes from "./routes/imageRoutes";
import executivesRoutes from "./routes/executivesRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import webhookRoutes from "./routes/webhookRoutes";
import sponsorRoutes from "./routes/sponsorRoutes";
import contactRoutes from "./routes/contactRoutes";
import userRoutes from "./routes/userRoutes";
import { User } from "./model/user";

// app config
dotenv.config({ quiet: true });

const port: number = Number(process.env.PORT) || 3000;
const app: express.Application = express();

let mongoUrl: string;
if (process.env.MONGODB_STD_CONNECT === "true") {
  // Optional for developmental usage where DNS resolution of SRV records fail.
  mongoUrl = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@ac-pcfgzmm-shard-00-00.cf1fyh5.mongodb.net:27017,ac-pcfgzmm-shard-00-01.cf1fyh5.mongodb.net:27017,ac-pcfgzmm-shard-00-02.cf1fyh5.mongodb.net:27017/?ssl=true&replicaSet=atlas-b12118-shard-0&authSource=admin&appName=kac-prod`;
} else {
  // Default SRV connection string for production usage.
  mongoUrl = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@kac-prod.cf1fyh5.mongodb.net/`;
}

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
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleUid: profile.id });
        // Attach hasAccount flag so the callback route can redirect accordingly
        (profile as any).hasAccount = !!existingUser;
        return done(null, profile);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: Express.User, done) => done(null, user));

// middleware
app.use("/api/payments", webhookRoutes); // webhook route must be registered before express.json()
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/executives", executivesRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/users", userRoutes);

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
