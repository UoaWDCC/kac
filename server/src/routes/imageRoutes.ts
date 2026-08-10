import express from "express";
import {
  getImagesByGalleryKey,
  getCurrentProfileImage,
  getImageById,
  getImageByTag,
  listImages,
  uploadCurrentProfileImage,
  uploadImage,
} from "../controllers/imageController";
import { upload } from "../middlewares/upload";
import { adminGuard } from "../middlewares/adminGuard";

const router = express.Router();

router.get("/profile/me", getCurrentProfileImage);
router.post("/profile/me", upload.single("image"), uploadCurrentProfileImage);
router.get("/tag/:tag", getImageByTag);
router.get("/gallery/:galleryKey", getImagesByGalleryKey);
router.get("/", listImages);
router.get("/:id", getImageById);
router.post("/", adminGuard, upload.single("image"), uploadImage);

export default router;
