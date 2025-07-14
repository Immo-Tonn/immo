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

    // 2. Update the name
    if (title) {
      video.title = title;
    }

    // 3. Processing video file replacement
    if (newVideoFile) {
      // Проверяем, существует ли новый файл
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

      //Update data in db
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
