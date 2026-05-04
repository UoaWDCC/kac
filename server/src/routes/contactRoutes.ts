import express from "express";
import { addContact, getContacts } from "../controllers/contactController";

const router = express.Router();

router.post("/", addContact);
router.get("/", getContacts);

export default router;
