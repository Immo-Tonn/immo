import express from 'express';
import multer from 'multer';
import {
  getAllImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage,
  deleteImageByUrl,
  getImagesByObjectId,
  updateImageMetadata,
} from '../controllers/imagesController';
import { protectImageRoutes } from '../middleware/adminRouteMiddleware';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.put('/:id', protectImageRoutes, updateImageMetadata);
router.delete('/delete-by-url', protectImageRoutes, deleteImageByUrl);
router.get('/', getAllImages);
router.get('/by-object', getImagesByObjectId);
router.get('/:id', getImageById);
router.post('/', protectImageRoutes, upload.single('file'), createImage);
router.put('/:id', protectImageRoutes, upload.single('file'), updateImage);
router.delete('/:id', protectImageRoutes, deleteImage);
router.delete('/delete-by-url', protectImageRoutes, deleteImageByUrl);

export default router;
