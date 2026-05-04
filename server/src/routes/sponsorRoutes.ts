import express from "express";
import { Sponsor } from "../model/sponsors";

const router = express.Router();

router.post("/", async (req, res) => {
  const sponsor = await Sponsor.create(req.body);
  res.json(sponsor);
});

router.get("/", async (req, res) => {
  const sponsors = await Sponsor.find();
  res.json(sponsors);
});

router.put("/:id", async (req, res) => {
  const updated = await Sponsor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Sponsor.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
