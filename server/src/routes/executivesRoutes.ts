import express from "express";

import {
  addExec,
  editExec,
  deleteExec,
  getAllExecs,
} from "../controllers/executivesController";

const router = express.Router();

router.get("/", getAllExecs);
router.post("/", addExec);
router.put("/:id", editExec);
router.delete("/:id", deleteExec);

export default router;
