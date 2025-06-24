import express from 'express';
import multer from 'multer';
import {
  getAllImages,
  getImageById,
  createImage,
  updateImage,
  deleteImage,
  getImagesByObjectId,
} from '../controllers/imagesController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getAllImages);
router.get('/by-object', getImagesByObjectId);
router.get('/:id', getImageById);
router.post('/', upload.single('file'), createImage);
router.put('/:id', upload.single('file'), updateImage);
router.delete('/:id', deleteImage);

export default router;
