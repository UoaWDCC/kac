import express from "express";
import { getFaqs } from "../controllers/faqController";

const router = express.Router();
router.get("/", getFaqs);

export default router;
