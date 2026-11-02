import express from "express";
import {
  createSponsor,
  deleteSponsor,
  getSponsors,
  updateSponsor,
} from "../controllers/sponsorController";
import { adminGuard } from "../middlewares/adminGuard";

const router = express.Router();

router.post("/", adminGuard, createSponsor);
router.get("/", getSponsors);
router.put("/:id", adminGuard, updateSponsor);
router.delete("/:id", adminGuard, deleteSponsor);

export default router;
