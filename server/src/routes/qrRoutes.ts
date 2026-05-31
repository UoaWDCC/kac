import express from "express";
import { generatePassQR, verifyPassQR } from "../controllers/qrController";

const router = express.Router();

router.get("/qr", generatePassQR);
router.get("/verify/:token", verifyPassQR);

export default router;
