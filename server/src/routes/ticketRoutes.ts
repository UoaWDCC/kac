import express from "express";
import {
  cancelTicket,
  createTicket,
  getTicketsByEventID,
  getTicketsByUserID,
  promoteTicket,
  updateTicketAttendance,
} from "../controllers/ticketController";
import { adminGuard } from "../middlewares/adminGuard";

const router = express.Router();

router.post("/", createTicket);
router.get("/me", getTicketsByUserID);

router.get("/event/:eventId", adminGuard, getTicketsByEventID);

router.patch(
  "/event/:eventId/:ticketId/attendance",
  adminGuard,
  updateTicketAttendance
);

router.delete("/event/:eventId/:ticketId", adminGuard, cancelTicket);

router.post("/event/:eventId/:ticketId/promote", adminGuard, promoteTicket);

export default router;
