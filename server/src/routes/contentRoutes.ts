import express from "express";
import {
  getContents,
  createContent,
  updateContent,
  deleteContent,
  deleteAllContents,
} from "../controllers/contentController";

const router = express.Router();
router.get("/", getContents);
router.post("/", createContent);
router.put("/:id", updateContent);
router.delete("/:id", deleteContent);
router.delete("/", deleteAllContents);

export default router;
