import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/userController";
import { adminGuard } from "../middlewares/adminGuard";

const router = express.Router();

router.get("/", adminGuard, getUsers);
router.put("/:id", adminGuard, updateUser);
router.delete("/:id", adminGuard, deleteUser);
router.post("/signup", createUser);

export default router;
