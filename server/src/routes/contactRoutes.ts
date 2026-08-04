import express from "express";
import {
  addContact,
  deleteContact,
  getContacts,
  updateContact,
} from "../controllers/contactController";
import { adminGuard } from "../middlewares/adminGuard";

const router = express.Router();

router.post("/", addContact);
router.get("/", adminGuard, getContacts);
router.put("/:id", adminGuard, updateContact);
router.delete("/:id", adminGuard, deleteContact);

export default router;
