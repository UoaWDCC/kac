import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Testing } from "./model/testing";

dotenv.config({ quiet: true });

const port: number = Number(process.env.PORT) || 3000;
const app: express.Application = express();
const mongoUrl: string = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@kac-prod.cf1fyh5.mongodb.net/`;

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
