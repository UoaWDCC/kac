import express from "express";
import {
  cancelTicket,
  createTicket,
  getTicketsByEventID,
  getTicketsByUserID,
  getTicketsByUserId,
  promoteTicket,
  updateTicketAttendance,
} from "../controllers/ticketController";
import { adminGuard } from "../middlewares/adminGuard";
import { requireUser } from "../middlewares/authUser";

const router = express.Router();

router.post("/", requireUser, createTicket);
router.get("/", requireUser, getTicketsByUserId);
router.get("/me", requireUser, getTicketsByUserID);

router.get("/event/:eventId", adminGuard, getTicketsByEventID);

router.patch(
  "/event/:eventId/:ticketId/attendance",
  adminGuard,
  updateTicketAttendance
);

router.delete("/event/:eventId/:ticketId", adminGuard, cancelTicket);

router.post("/event/:eventId/:ticketId/promote", adminGuard, promoteTicket);

export default router;
