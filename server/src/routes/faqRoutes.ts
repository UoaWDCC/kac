import express from "express";
import { getFaqs, createFaq } from "../controllers/faqController";

const router = express.Router();
router.get("/", getFaqs);
router.get("/", createFaq);

export default router;
