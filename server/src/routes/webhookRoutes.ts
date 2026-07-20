import express from "express";
import { handleWebhook } from "../controllers/webhookController";

const router = express.Router();

// Stripe requires the raw request body to verify webhook signatures.
// express.raw() is applied at the route level, before express.json() in index.ts touches this request.
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

export default router;
