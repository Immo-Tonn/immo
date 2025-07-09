import express from "express";
import multer from "multer";
import path from "path";
import {
  uploadVideo,
  deleteVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  getVideosByObjectId,
} from "../controllers/videosController";
import { protectVideoRoutes } from "../middleware/adminRouteMiddleware";
import { uploadSingleVideo } from "../middleware/uploadMiddleware";
const router = express.Router();
// const upload = multer({ dest: "uploads/" });

router.post("/", protectVideoRoutes, uploadSingleVideo, uploadVideo);
// router.post("/", protectVideoRoutes, upload.single("video"), uploadVideo);
router.delete("/:id", protectVideoRoutes,  deleteVideo);
router.put("/:id", protectVideoRoutes, uploadSingleVideo, updateVideo);
// router.put("/:id", protectVideoRoutes,  upload.single("video"), updateVideo);
router.get("/", getAllVideos);
router.get("/by-object", getVideosByObjectId);
router.get("/:id", getVideoById);

export default router;
