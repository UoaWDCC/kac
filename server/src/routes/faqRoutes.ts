import express from "express";
import { listFaqs } from "../controllers/faqController";

const router = express.Router();
router.get("/", listFaqs);

export default router;
