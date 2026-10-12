import express from "express";
import { createTicket, getTicketsByUserId } from "../controllers/ticketController";

const router = express.Router();

router.post("/", createTicket);
router.get("/", getTicketsByUserId)

export default router;
