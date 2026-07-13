import express from "express";

import {
  addExec,
  editExec,
  deleteExec,
  getAllExecs,
} from "../controllers/executivesController";
import { adminGuard } from "../middlewares/adminGuard";

const router = express.Router();

router.get("/", getAllExecs);
router.post("/", adminGuard, addExec);
router.put("/:id", adminGuard, editExec);
router.delete("/:id", adminGuard, deleteExec);

export default router;
