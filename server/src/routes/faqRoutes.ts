import express from "express";
import { getFaqs, createFaq, updateFaq } from "../controllers/faqController";

const router = express.Router();
router.get("/", getFaqs);
router.get("/", createFaq);
router.get("/", updateFaq);

export default router;
