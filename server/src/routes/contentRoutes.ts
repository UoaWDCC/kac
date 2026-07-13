import express from "express";
import {
  getContent,
  createContent,
  updateContent,
  deleteContent,
} from "../controllers/contentController";
import { adminGuard } from "../middlewares/adminGuard";

const router = express.Router();
router.get("/:id", getContent);
router.post("/", adminGuard, createContent);
router.put("/:id", adminGuard, updateContent);
router.delete("/:id", adminGuard, deleteContent);

export default router;
