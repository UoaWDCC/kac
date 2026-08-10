import express from "express";

import {
  addEvent,
  deleteEvent,
  getAllEvents,
  getPastEventBySlug,
  getEventById,
} from "../controllers/eventController";
import { adminGuard } from "../middlewares/adminGuard";

const router = express.Router();

router.get("/", getAllEvents);
router.get("/past/:slug", getPastEventBySlug);
router.get("/:id", getEventById);
router.post("/", adminGuard, addEvent);
router.delete("/:id", adminGuard, deleteEvent);

export default router;
