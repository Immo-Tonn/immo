import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  uploadVideo,
  uploadTempVideo,
  processTempVideos,
  cleanupTempVideos,
  deleteVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  getVideosByObjectId,
} from '../controllers/videosController';
import { protectVideoRoutes } from '../middleware/adminRouteMiddleware';
import { uploadSingleVideo } from '../middleware/uploadMiddleware';
const router = express.Router();

// routes for temporary files
router.post('/temp', protectVideoRoutes, uploadSingleVideo, uploadTempVideo);
router.post('/process-temp', protectVideoRoutes, processTempVideos);
router.post('/cleanup-temp', protectVideoRoutes, cleanupTempVideos);

router.post('/', protectVideoRoutes, uploadSingleVideo, uploadVideo);
router.delete('/:id', protectVideoRoutes, deleteVideo);
router.put('/:id', protectVideoRoutes, uploadSingleVideo, updateVideo);
router.get('/', getAllVideos);
router.get('/by-object', getVideosByObjectId);
router.get('/:id', getVideoById);

export default router;
