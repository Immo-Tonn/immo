import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

import { uploadToBunny } from '../utils/uploadImages';
import { deleteFromBunny } from '../utils/deleteImages';

// Create a directory for temporary downloads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Setting up storage for temporary files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate a unique file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File Type Filter for images only
const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Nur JPG, PNG und WebP-Dateien sind zulässig!'));
  }
};

// File Type Filter for videos only
const videoFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedTypes = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/quicktime',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error('Nur MP4, AVI, MOV, WMV, FLV und WebM-Dateien sind zulässig!'),
    );
  }
};

// Combined file filter for both images and videos
const combinedFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  const videoTypes = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/quicktime',
  ];

  const allAllowedTypes = [...imageTypes, ...videoTypes];

  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Nur Bild- (JPG, PNG, WebP) und Video-Dateien (MP4, AVI, MOV, WMV, FLV, WebM) sind zulässig!',
      ),
    );
  }
};

// Setting up multer for images
const uploadImages = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5МБ
  },
  fileFilter: imageFileFilter,
});

// Setting up multer for videos
const uploadVideos = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100МB for videos
  },
  fileFilter: videoFileFilter,
});

// Setting up multer for combined uploads
const uploadCombined = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100МБ
  },
  fileFilter: combinedFileFilter,
});

// Middleware for handling file upload errors
export const handleUploadErrors = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message:
          'Die Datei ist zu groß. Max. 5MB für Bilder, 100MB für Videos.',
      });
    }
    return res
      .status(400)
      .json({ message: `Fehler beim Hochladen: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// Export middleware to upload a single image
export const uploadSingleImage = uploadImages.single('image');

// Export middleware to upload multiple images
export const uploadMultipleImages = uploadImages.array('images', 10); // максимум 10 изображений

// Export middleware to upload a single video
export const uploadSingleVideo = uploadVideos.single('video');

// Export middleware for combined uploads
export const uploadSingleFile = uploadCombined.single('file');

// Export functions from utilities (to make them easier to use)
export { uploadToBunny, deleteFromBunny };
