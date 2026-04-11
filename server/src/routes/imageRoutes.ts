import express from "express";
import {
  getImageById,
  listImages,
  uploadImage,
} from "../controllers/imageController";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.post("/", upload.single("image"), uploadImage);
router.get("/", listImages);
router.get("/:id", getImageById);

export default router;
