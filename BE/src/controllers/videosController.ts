import { Request, Response } from 'express';
import VideoModel from '../models/VideoModel';
import RealEstateObjectsModel from '../models/RealEstateObjectsModel';
import { uploadToBunnyVideo } from '../utils/uploadBunnyVideo';
import { deleteFromBunnyVideo } from '../utils/deleteBunnyVideo';
import {
  convertToIframeUrl,
  getVideoThumbnailUrl,
} from '../utils/videoHelpers';

export const uploadVideo = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { realEstateObjectId, title } = req.body;

    if (!realEstateObjectId) {
      res.status(400).json({ error: 'realEstateObjectId is required' });
      return;
    }

    const videoFile = req.file;

    if (!videoFile) {
      res.status(400).json({ error: 'Video file required' });
      return;
    }

    const { videoId, videoUrl, thumbnailUrl } = await uploadToBunnyVideo(
      videoFile.path,
      title || 'Untitled',
    );

    const videoDoc = await VideoModel.create({
      url: videoUrl,
      thumbnailUrl,
      title: title || 'Untitled',
      videoId,
      realEstateObject: realEstateObjectId,
      dateAdded: new Date(),
    });

    await RealEstateObjectsModel.findByIdAndUpdate(realEstateObjectId, {
      $push: { videos: videoDoc._id },
    });

    res.status(201).json(videoDoc);
  } catch (error: any) {
    console.error('Upload error:', error);
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

// Получить видео по ID
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

    // 1. Обновляем привязку к объекту недвижимости, если изменилась
    if (
      realEstateObjectId &&
      video.realEstateObject?.toString() !== realEstateObjectId
    ) {
      // Удалить из старого объекта
      await RealEstateObjectsModel.findByIdAndUpdate(video.realEstateObject, {
        $pull: { videos: video._id },
      });
      // Добавить в новый объект
      await RealEstateObjectsModel.findByIdAndUpdate(realEstateObjectId, {
        $push: { videos: video._id },
      });
      video.realEstateObject = realEstateObjectId;
    }

    // 2. Обновляем название
    if (title) {
      video.title = title;
    }

    // 3. Обработка замены видеофайла
    if (newVideoFile) {
      // Удаляем старое видео из Bunny
      if (video.videoId) {
        await deleteFromBunnyVideo(video.videoId);
      }

      // Загружаем новое видео в Bunny
      const { videoId, videoUrl, thumbnailUrl } = await uploadToBunnyVideo(
        newVideoFile.path,
        title || video.title || 'Untitled',
      );

      // Обновляем данные в БД
      video.videoId = videoId;
      video.url = videoUrl;
      video.thumbnailUrl = thumbnailUrl;
    }

    // 4. Сохраняем изменения
    await video.save();

    res.status(200).json(video);
  } catch (error: any) {
    console.error('Update video error:', error);
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
