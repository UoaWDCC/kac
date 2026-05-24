import express from "express";

import {
  addEvent,
  deleteEvent,
  getAllEvents,
} from "../controllers/eventController";

const router = express().Router();

router.get("/", getAllEvents);
router.post("/", addEvent);
router.delete("/:id", deleteEvent);

export default router;