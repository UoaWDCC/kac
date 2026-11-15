import express from "express";
import {
  getMembershipPrice,
  updateMembershipPrice,
} from "../controllers/membershipPriceController";
import { adminGuard } from "../middlewares/adminGuard";

const router = express.Router();

router.get("/", getMembershipPrice);
router.put("/", adminGuard, updateMembershipPrice);

export default router;
