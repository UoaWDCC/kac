import express from "express";
import { generateQR, verifyQR } from "../controllers/qrController";

const router = express.Router();

router.get("/generate", generateQR);
router.get("/verify/:token", verifyQR);

export default router;
