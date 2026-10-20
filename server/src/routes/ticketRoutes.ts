import express from "express";
import {
  createTicket,
  getTicketsByUserId,
} from "../controllers/ticketController";
import { requireUser } from "../middlewares/authUser";

const router = express.Router();

router.post("/", requireUser, createTicket);
router.get("/", requireUser, getTicketsByUserId);

export default router;
