// immo/BE/src/controllers/imagesController.ts
import { Request, Response } from 'express';
import ImagesModel from '../models/ImagesModel';
import RealEstateObjectsModel from '../models/RealEstateObjectsModel';
import { uploadToBunny } from '../utils/uploadImages';
import { deleteFromBunny } from '../utils/deleteImages';
import { transformBunnyUrl } from '../utils/getImages';
import path from 'path';
import fs from 'fs';
import {
  getAllImagesHelper,
  getImageByIdHelper,
  // getImagesByObjectIdHelper,
} from '../utils/getImages';

export const getAllImages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const images = await getAllImagesHelper();
    if (!images || images.length === 0) {
      console.log('ℹ️ Изображения не найдены, возвращаем пустой массив');
      res.status(200).json([]); // Возвращаем пустой массив вместо 404
      return;
    }
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({
      message: 'Fehler beim Abrufen der Bilder',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getImageById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const image = await getImageByIdHelper(req.params.id);

    if (!image) {
      res.status(404).json({ message: 'Bild nicht gefunden' });
      return;
    }

    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({
      message: 'Fehler beim Abrufen des Bildes',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getImagesByObjectId = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const objectId = req.query.objectId as string;
    if (!objectId) {
      res
        .status(400)
        .json({ message: "Parameter 'objectId' ist erforderlich" });
      return;
    }

    // Get object to correct order of images
    const realEstateObject = await RealEstateObjectsModel.findById(objectId);
    if (!realEstateObject) {
      res.status(404).json({ message: 'Объект недвижимости не найден' });
      return;
    }

    // All images of the object
    const allImages = await ImagesModel.find({
      realEstateObject: objectId,
    });

    if (!allImages || allImages.length === 0) {
      console.log(
        `ℹ️ Изображения не найдены для объекта ${objectId}, возвращаем пустой массив`,
      );

      // Add Headers to Prevent Caching
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      });

      res;
      res.status(200).json([]);
      return;
    }

    let sortedImages = [...allImages];

    if (realEstateObject.images && realEstateObject.images.length > 0) {
      console.log(
        'Сортируем изображения согласно порядку в БД:',
        realEstateObject.images,
      );

      const orderedImages: any[] = [];

      // Sort images according to order in object
      realEstateObject.images.forEach(imageId => {
        const image = allImages.find(
          img =>
            (img._id && img._id.toString() === imageId.toString()) ||
            (img.id && img.id.toString() === imageId.toString()),
        );
        if (image) {
          orderedImages.push(image);
        }
      });

      // Then add images that are not in the order list
      allImages.forEach(image => {
        const imageId = image._id || image.id;
        const isAlreadyAdded = orderedImages.some(
          orderedImg =>
            (orderedImg._id &&
              orderedImg._id.toString() === imageId.toString()) ||
            (orderedImg.id && orderedImg.id.toString() === imageId.toString()),
        );
        if (!isAlreadyAdded) {
          orderedImages.push(image);
        }
      });

      sortedImages = orderedImages;
      console.log(
        'Изображения отсортированы:',
        sortedImages.map(img => img._id),
      );
    } else {
      // If the order is not specified, sort by type (main first, then the rest)
      sortedImages.sort((a, b) => {
        if (a.type === 'main' && b.type !== 'main') return -1;
        if (a.type !== 'main' && b.type === 'main') return 1;
        return 0;
      });
      console.log('Сортировка по типу (main первым)');
    }

    const timestamp = Date.now();

    // transform the URL for delivery to the client
    const imagesWithTransformedUrls = sortedImages.map(img => ({
      ...img.toObject(),
      url: `${transformBunnyUrl(img.url)}?t=${timestamp}`,
    }));

    // headlines to prevent caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
      'Last-Modified': new Date().toUTCString(),
      ETag: `"${timestamp}"`,
    });

    console.log('Отправляем отсортированные изображения клиенту');
    res.status(200).json(imagesWithTransformedUrls);
  } catch (error) {
    console.error('Ошибка при получении изображений по objectId:', error);
    res.status(500).json({
      message: 'Fehler beim Abrufen der Bilder nach Objekt-ID',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const createImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const file = req.file;
  const localFilePath = file ? path.resolve(file.path) : '';

  try {
    const { realEstateObject, type } = req.body;

    if (!file) {
      res.status(400).json({ message: 'Datei nicht hochgeladen' });
      return;
    }

    const realEstate = await RealEstateObjectsModel.findById(realEstateObject);
    if (!realEstate) {
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }

    const url = await uploadToBunny(localFilePath, file.originalname);

    const newImage = new ImagesModel({
      realEstateObject,
      url,
      type,
    });
    const savedImage = await newImage.save();

    realEstate.images?.push(savedImage.id);
    await realEstate.save();

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    res.status(201).json(savedImage);
  } catch (error: any) {
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Fehler beim Erstellen des Bildes:', error);

    res.status(500).json({
      message: 'Fehler beim Erstellen des Bildes',
      error: errorMessage,
    });
  }
};

export const updateImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const file = req.file;
  const localFilePath = file ? path.resolve(file.path) : '';

  try {
    const existingImage = await ImagesModel.findById(req.params.id);
    if (!existingImage) {
      res.status(404).json({ message: 'Bild nicht gefunden' });
      return;
    }

    let updatedData: any = { ...req.body };

    if (file) {
      const newUrl = await uploadToBunny(localFilePath, file.originalname);

      try {
        await deleteFromBunny(existingImage.url);
      } catch (cdnErr) {
        console.warn(
          'Altes Bild konnte nicht vom CDN entfernt werden:',
          cdnErr,
        );
      }

      updatedData.url = newUrl;

      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    }

    const updatedImage = await ImagesModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );

    res.status(200).json(updatedImage);
  } catch (error: any) {
    if (file && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    res.status(500).json({
      message: 'Fehler beim Aktualisieren des Bildes',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const deletedImage = await ImagesModel.findByIdAndDelete(req.params.id);
    if (!deletedImage) {
      res.status(404).json({ message: 'Bild nicht gefunden' });
      return;
    }

    try {
      await deleteFromBunny(deletedImage.url);
    } catch (cdnErr) {
      console.warn('Datei konnte nicht vom CDN gelöscht werden:', cdnErr);
    }

    await RealEstateObjectsModel.findByIdAndUpdate(
      deletedImage.realEstateObject,
      { $pull: { images: deletedImage._id } },
    );

    res.status(200).json({ message: 'Bild entfernt' });
  } catch (error) {
    res.status(500).json({
      message: 'Fehler beim Löschen des Bildes',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteImageByUrl = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({ message: 'Image URL not provided' });
      return;
    }

    // Find the image by URL
    const image = await ImagesModel.findOne({ url: imageUrl });

    if (!image) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }

    // Remove  image from BunnyCDN
    try {
      await deleteFromBunny(image.url);
    } catch (cdnErr) {
      console.warn('Failed to remove image from CDN:', cdnErr);
    }

    // Remove image from db
    await ImagesModel.findByIdAndDelete(image._id);

    // Remove ID image from real estate object
    await RealEstateObjectsModel.findByIdAndUpdate(image.realEstateObject, {
      $pull: { images: image._id },
    });

    res.status(200).json({ message: 'Image successfully deleted' });
  } catch (error) {
    console.error('Error deleting image by URL:', error);
    res.status(500).json({
      message: 'Error deleting image',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const updateImageMetadata = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedImage = await ImagesModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedImage) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }

    res.status(200).json(updatedImage);
  } catch (error) {
    console.error('Error updating image metadata:', error);
    res.status(500).json({
      message: 'Error updating image',
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
