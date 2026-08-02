import express from "express";

import {
  addEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
} from "../controllers/eventController";
import { adminGuard } from "../middlewares/adminGuard";

const router = express.Router();

router.get("/ ", getAllEvents);
router.get("/:id", getEventById);
router.post("/", adminGuard, addEvent);
router.delete("/:id", adminGuard, deleteEvent);

export default router;
