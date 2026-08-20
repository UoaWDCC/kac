import express from "express";
import {
  getGalleryImagesByTagAndYear,
  getImageById,
  getImageByTag,
  listImages,
  getCurrentProfileImage,
  uploadCurrentProfileImage,
  uploadImage,
} from "../controllers/imageController";
import { upload } from "../middlewares/upload";
import { adminGuard } from "../middlewares/adminGuard";

const router = express.Router();

router.get("/profile/me", getCurrentProfileImage);
router.post("/profile/me", upload.single("image"), uploadCurrentProfileImage);
router.get("/tag/:tag", getImageByTag);
router.get("/gallery", getGalleryImagesByTagAndYear);
router.get("/", listImages);
router.get("/:id", getImageById);
router.post("/", adminGuard, upload.single("image"), uploadImage);

export default router;
