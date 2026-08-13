import express from "express";
import { createTicket } from "../controllers/ticketController";

const router = express.Router();

router.post("/", createTicket);

export default router;
