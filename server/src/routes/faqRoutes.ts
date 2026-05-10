import express from "express";
import { getFaqs, createFaq, updateFaq, deleteFaq} from "../controllers/faqController";

const router = express.Router();
router.get("/", getFaqs);
router.get("/", createFaq);
router.get("/", updateFaq);
router.get("/", deleteFaq);

export default router;
