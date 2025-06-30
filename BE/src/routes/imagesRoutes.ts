import express from "express";
import multer from "multer";
import {
  getAllImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage,
  deleteImageByUrl,
  getImagesByObjectId,
  updateImageMetadata,
} from "../controllers/imagesController";
import { protectImageRoutes } from "../middleware/adminRouteMiddleware";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// ИСПРАВЛЕНИЕ: Специальные маршруты должны идти ПЕРВЫМИ (до параметризованных)
router.post("/delete-by-url", protectImageRoutes, deleteImageByUrl); // POST метод!
router.get("/", getAllImages);
router.get("/by-object", getImagesByObjectId);

// Параметризованные маршруты должны идти ПОСЛЕДНИМИ
router.get("/:id", getImageById);
router.post("/", protectImageRoutes, upload.single("file"), createImage);
router.put("/:id", protectImageRoutes, upload.single("file"), updateImage);
router.put("/metadata/:id", protectImageRoutes, updateImageMetadata); // ИСПРАВЛЕН путь
router.delete("/:id", protectImageRoutes, deleteImage);

// router.put('/:id', protectImageRoutes, updateImageMetadata);
// router.delete('/delete-by-url', protectImageRoutes, deleteImageByUrl);
// router.get("/", getAllImages);
// router.get("/by-object", getImagesByObjectId);
// router.get("/:id", getImageById);
// router.post("/", protectImageRoutes, upload.single("file"), createImage);
// router.put("/:id", protectImageRoutes, upload.single("file"), updateImage);
// router.delete("/:id", protectImageRoutes, deleteImage);
// router.delete('/delete-by-url', protectImageRoutes, deleteImageByUrl);

export default router;


