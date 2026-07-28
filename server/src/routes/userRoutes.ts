import express from "express";
import {
  createUser,
  deleteUser,
  getCurrentUser,
  getUsers,
  updateCurrentUser,
  updateUser,
} from "../controllers/userController";
import { adminGuard } from "../middlewares/adminGuard";

const router = express.Router();

router.get("/me", getCurrentUser);
router.put("/me", updateCurrentUser);
router.get("/", adminGuard, getUsers);
router.put("/:id", adminGuard, updateUser);
router.delete("/:id", adminGuard, deleteUser);
router.post("/signup", createUser);

export default router;
