import { Request, Response } from 'express';
import VideoModel from '../models/VideoModel';
import RealEstateObjectsModel from '../models/RealEstateObjectsModel';
import { uploadToBunnyVideo } from '../utils/uploadBunnyVideo';
import { deleteFromBunnyVideo } from '../utils/deleteBunnyVideo';
import {
  convertToIframeUrl,
  getVideoThumbnailUrl,
} from '../utils/videoHelpers';
import fs from 'fs';
import path from 'path';

export const uploadTempVideo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log('🎯 TEMP VIDEO ENDPOINT CALLED!');
    console.log('📋 Request body:', req.body);
    console.log('📁 Request file:', req.file?.originalname);

    const { title } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      console.error('❌ Видео файл не найден в запросе');
      res.status(400).json({ error: 'Video file required' });
      return;
    }

    // Checking if the file exists
    console.log('🔍 Путь к загруженному файлу:', videoFile.path);
    console.log('🔍 Полный путь:', path.resolve(videoFile.path));
    console.log('🔍 Файл существует:', fs.existsSync(videoFile.path));

    if (!fs.existsSync(videoFile.path)) {
      console.error('❌ Файл не существует по пути:', videoFile.path);
      res.status(400).json({ error: 'Uploaded file not found on server' });
      return;
    }

    console.log('✅ Временный видео файл сохранен:', videoFile.path);

    // Return information about the temporary file (without downloading to Bunny CDN)
    res.status(201).json({
      tempId: videoFile.filename,
      originalName: videoFile.originalname,
      title: title || 'Untitled',
      size: videoFile.size,
      path: videoFile.path,
      mimetype: videoFile.mimetype,
    });
  } catch (error: any) {
    console.error('❌ Temp upload error:', error);

    // delete temporary file when error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🧹 Временный файл удален после ошибки');
      } catch (unlinkError) {
        console.warn(
          '⚠️ Не удалось удалить временный файл после ошибки:',
          unlinkError,
        );
      }
    }

    res.status(500).json({
      error: 'Temp upload failed',
      details: error.message || error,
    });
  }
};
// Download temporary video in db after creating an object
export const processTempVideos = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log('🎥 Начинаем обработку временных видео...');
    const { realEstateObjectId, tempFiles } = req.body;

    if (!realEstateObjectId) {
      res.status(400).json({ error: 'realEstateObjectId is required' });
      return;
    }

    if (!tempFiles || !Array.isArray(tempFiles) || tempFiles.length === 0) {
      res.status(400).json({ error: 'tempFiles array is required' });
      return;
    }

    const processedVideos = [];

    for (const tempFile of tempFiles) {
      const { tempId, title, originalName } = tempFile;

      // File search function
      const findTempFile = (tempId: string): string | null => {
        const possiblePaths = [
          path.resolve(process.cwd(), 'uploads', tempId),
          path.join(__dirname, '../../uploads', tempId),
          path.join(process.cwd(), 'uploads', tempId),
          path.join(__dirname, '../uploads', tempId),
          `uploads/${tempId}`,
          `./uploads/${tempId}`,
        ];

        for (const possiblePath of possiblePaths) {
          if (fs.existsSync(possiblePath)) {
            console.log('✅ Файл найден по пути:', possiblePath);
            return possiblePath;
          }
        }

        return null;
      };

      const tempPath = findTempFile(tempId);

      if (!tempPath) {
        console.warn(`❌ Временный файл не найден: ${originalName}`);
        continue;
      }

      try {
        console.log(`✅ Обрабатываем временный файл: ${originalName}`);

        // download video in the Bunny CDN
        const { videoId, videoUrl, thumbnailUrl } = await uploadToBunnyVideo(
          tempPath,
          title || originalName || 'Untitled',
        );

        console.log('✅ Видео загружено в Bunny CDN:', { videoId, videoUrl });

        // create an entry in the database
        const videoDoc = await VideoModel.create({
          url: videoUrl,
          thumbnailUrl,
          title: title || originalName || 'Untitled',
          videoId,
          realEstateObject: realEstateObjectId,
          dateAdded: new Date(),
        });

        console.log('✅ Видео сохранено в БД:', videoDoc._id);

        // Add video to the real estate object
        await RealEstateObjectsModel.findByIdAndUpdate(realEstateObjectId, {
          $push: { videos: videoDoc._id },
        });

        processedVideos.push(videoDoc);

        // delete a temporary file after successful processing
        try {
          console.log('🗑️ Попытка удалить временный файл:', tempPath);
          fs.unlinkSync(tempPath);
          console.log('✅ Временный файл удален:', tempPath);
        } catch (unlinkError) {
          console.warn('⚠️ Не удалось удалить временный файл:', unlinkError);
          console.warn('📁 Путь к файлу:', tempPath);
          console.warn(
            '📁 Файл существует перед удалением:',
            fs.existsSync(tempPath),
          );
        }
      } catch (fileError: any) {
        console.error(
          `❌ Ошибка при обработке файла ${originalName}:`,
          fileError,
        );
      }
    }

    console.log(
      `✅ Обработано ${processedVideos.length} из ${tempFiles.length} временных видео`,
    );

    res.status(201).json({
      message: `Processed ${processedVideos.length} videos successfully`,
      videos: processedVideos,
    });
  } catch (error: any) {
    console.error('❌ Process temp videos error:', error);
    res.status(500).json({
      error: 'Failed to process temp videos',
      details: error.message || error,
    });
  }
};

// cleaning old temporary files
export const cleanupTempVideos = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { tempIds } = req.body;

    if (!tempIds || !Array.isArray(tempIds)) {
      res.status(400).json({ error: 'tempIds array is required' });
      return;
    }

    let deletedCount = 0;

    for (const tempId of tempIds) {
      const tempPath = path.resolve(process.cwd(), 'uploads', tempId);
      console.log('🔍 Cleanup: ищем файл по пути:', tempPath);

      if (fs.existsSync(tempPath)) {
        try {
          fs.unlinkSync(tempPath);
          deletedCount++;
          console.log('🧹 Удален временный файл:', tempPath);
        } catch (error) {
          console.warn(
            '⚠️ Не удалось удалить временный файл:',
            tempPath,
            error,
          );
        }
      } else {
        // Additional check: Alternative ways
        const alternativePaths = [
          path.join(__dirname, '../../uploads', tempId),
          path.join(process.cwd(), 'uploads', tempId),
          path.join(__dirname, '../uploads', tempId),
        ];

        for (const altPath of alternativePaths) {
          if (fs.existsSync(altPath)) {
            try {
              fs.unlinkSync(altPath);
              deletedCount++;
              console.log(
                '🧹 Удален временный файл (альтернативный путь):',
                altPath,
              );
              break;
            } catch (error) {
              console.warn(
                '⚠️ Не удалось удалить временный файл:',
                altPath,
                error,
              );
            }
          }
        }
      }
    }

    res.status(200).json({
      message: `Deleted ${deletedCount} temp files`,
      deletedCount,
    });
  } catch (error: any) {
    console.error('❌ Cleanup error:', error);
    res.status(500).json({
      error: 'Cleanup failed',
      details: error.message,
    });
  }
};

export const uploadVideo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    console.log('🎥 Начинаем загрузку видео...');
    console.log('📋 Body:', req.body);
    console.log(
      '📁 File:',
      req.file
        ? {
            filename: req.file.filename,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
          }
        : 'Файл не найден',
    );
    const { realEstateObjectId, title } = req.body;

    if (!realEstateObjectId) {
      console.error('❌ Отсутствует realEstateObjectId');
      res.status(400).json({ error: 'realEstateObjectId is required' });
      return;
    }

    const videoFile = req.file;

    if (!videoFile) {
      console.error('❌ Видео файл не найден в запросе');
      res.status(400).json({ error: 'Video file required' });
      return;
    }

    // Checking if the file exists
    if (!fs.existsSync(videoFile.path)) {
      console.error('❌ Файл не существует по пути:', videoFile.path);
      res.status(400).json({ error: 'Uploaded file not found on server' });
      return;
    }

    console.log('✅ Файл найден, начинаем загрузку в Bunny CDN...');

    const { videoId, videoUrl, thumbnailUrl } = await uploadToBunnyVideo(
      videoFile.path,
      title || 'Untitled',
    );

    console.log('✅ Видео загружено в Bunny CDN:', { videoId, videoUrl });

    const videoDoc = await VideoModel.create({
      url: videoUrl,
      thumbnailUrl,
      title: title || 'Untitled',
      videoId,
      realEstateObject: realEstateObjectId,
      dateAdded: new Date(),
    });

    console.log('✅ Видео сохранено в БД:', videoDoc._id);

    await RealEstateObjectsModel.findByIdAndUpdate(realEstateObjectId, {
      $push: { videos: videoDoc._id },
    });

    console.log('✅ Видео добавлено к объекту недвижимости');

    // Delete temporary file
    try {
      fs.unlinkSync(videoFile.path);
      console.log('✅ Временный файл удален:', videoFile.path);
    } catch (unlinkError) {
      console.warn('⚠️ Не удалось удалить временный файл:', unlinkError);
    }

    res.status(201).json(videoDoc);
  } catch (error: any) {
    console.error('❌ Upload error:', error);

    // Trying to delete a temporary file in case of an error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🧹 Временный файл удален после ошибки');
      } catch (unlinkError) {
        console.warn(
          '⚠️ Не удалось удалить временный файл после ошибки:',
          unlinkError,
        );
      }
    }

    res
      .status(500)
      .json({ error: 'Upload failed', details: error.message || error });
  }
};

export const deleteVideo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const video = await VideoModel.findById(id);

    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    if (video.videoId) {
      await deleteFromBunnyVideo(video.videoId);
    }

    await RealEstateObjectsModel.findByIdAndUpdate(video.realEstateObject, {
      $pull: { videos: video._id },
    });

    await video.deleteOne();

    res.json({ message: 'Video deleted' });
  } catch (error: any) {
    console.error('Delete error:', error);
    res
      .status(500)
      .json({ error: 'Deletion failed', details: error.message || error });
  }
};

export const getAllVideos = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const videos = await VideoModel.find().populate('realEstateObject');

    const transformedVideos = videos.map(video => ({
      ...video.toObject(),
      url: convertToIframeUrl(video.url),
      thumbnailUrl: getVideoThumbnailUrl(video.url),
    }));

    res.status(200).json(transformedVideos);
  } catch (error: any) {
    console.error('Get all videos error:', error);
    res.status(500).json({
      error: 'Failed to fetch videos',
      details: error.message || error,
    });
  }
};

// Get video by ID
export const getVideoById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const video = await VideoModel.findById(id).populate('realEstateObject');

    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    const transformedVideo = {
      ...video.toObject(),
      url: convertToIframeUrl(video.url),
      thumbnailUrl: getVideoThumbnailUrl(video.url),
    };

    res.status(200).json(transformedVideo);
  } catch (error: any) {
    console.error('Get video by ID error:', error);
    res.status(500).json({
      error: 'Failed to fetch video',
      details: error.message || error,
    });
  }
};

export const updateVideo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, realEstateObjectId } = req.body;
    const newVideoFile = req.file;

    const video = await VideoModel.findById(id);
    if (!video) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    // 1. Update the link to real estate object if it has changed
    if (
      realEstateObjectId &&
      video.realEstateObject?.toString() !== realEstateObjectId
    ) {
      // Remove from old object
      await RealEstateObjectsModel.findByIdAndUpdate(video.realEstateObject, {
        $pull: { videos: video._id },
      });
      // Add to new object
      await RealEstateObjectsModel.findByIdAndUpdate(realEstateObjectId, {
        $push: { videos: video._id },
      });
      video.realEstateObject = realEstateObjectId;
    }

    // 2.  Update the name
    if (title) {
      video.title = title;
    }

    // 3. Processing video file replacement
    if (newVideoFile) {
      // check for new file
      if (!fs.existsSync(newVideoFile.path)) {
        res.status(400).json({ error: 'New video file not found on server' });
        return;
      }
      // Remove  old video from Bunny
      if (video.videoId) {
        await deleteFromBunnyVideo(video.videoId);
      }

      // Uploading new video to Bunny
      const { videoId, videoUrl, thumbnailUrl } = await uploadToBunnyVideo(
        newVideoFile.path,
        title || video.title || 'Untitled',
      );

      // Update data in db
      video.videoId = videoId;
      video.url = videoUrl;
      video.thumbnailUrl = thumbnailUrl;

      // Delete temporary file
      try {
        fs.unlinkSync(newVideoFile.path);
      } catch (unlinkError) {
        console.warn('⚠️ Не удалось удалить временный файл:', unlinkError);
      }
    }

    // 4. Save changes
    await video.save();

    res.status(200).json(video);
  } catch (error: any) {
    console.error('Update video error:', error);

    // Trying to delete temporary file in case of error
    if (req.file?.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.warn(
          '⚠️ Не удалось удалить временный файл после ошибки:',
          unlinkError,
        );
      }
    }

    res
      .status(500)
      .json({ error: 'Video update failed', details: error.message });
  }
};

export const getVideosByObjectId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const objectId = req.query.objectId as string;

    if (!objectId) {
      res.status(400).json({ error: 'Object ID is required' });
      return;
    }

    const videos = await VideoModel.find({ realEstateObject: objectId });

    const transformedVideos = videos.map(video => ({
      ...video.toObject(),
      url: convertToIframeUrl(video.url),
      thumbnailUrl: getVideoThumbnailUrl(video.url),
    }));

    res.status(200).json(transformedVideos);
  } catch (error: any) {
    console.error('Get videos by objectId error:', error);
    res.status(500).json({
      error: 'Failed to fetch videos',
      details: error.message || error,
    });
  }
};
