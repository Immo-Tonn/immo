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

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("video"), uploadVideo);
router.delete("/:id", deleteVideo);
router.put("/:id", upload.single("video"), updateVideo);
router.get("/", getAllVideos);
router.get("/by-object", getVideosByObjectId);
router.get("/:id", getVideoById);

export default router;
