import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { Testing } from "./model/testing";
import imageRoutes from "./routes/imageRoutes";
import faqRoutes from "./routes/faqRoutes";

// app config
dotenv.config({ quiet: true });

const port: number = Number(process.env.PORT) || 3000;
const app: express.Application = express();
const mongoUrl: string = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@kac-prod.cf1fyh5.mongodb.net/`;

// middleware
app.use(express.json());
app.use("/api/images", imageRoutes);
app.use("/api/faqs", faqRoutes)

app.get("/api/test", (req, res) => {
  res.send("Hi :)");
});

app.post("/api/test", (req, res) => {
  const testing = { name: "Default Name", value: 0 };
  Testing.create(testing)
    .then(() => {
      res.send("Test successful!");
    })
    .catch((err) => {
      console.error("Error creating testing document:", err);
      res.status(500).send("Error creating testing document");
    });
});

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
