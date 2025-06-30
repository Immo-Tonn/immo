// immo/BE/src/controllers/imagesController.ts
import { Request, Response } from "express";
import ImagesModel from "../models/ImagesModel";
import RealEstateObjectsModel from "../models/RealEstateObjectsModel";
import { uploadToBunny } from "../utils/uploadImages";
import { deleteFromBunny } from "../utils/deleteImages";
import { transformBunnyUrl } from "../utils/getImages";
import path from "path";
import fs from "fs";
import {
  getAllImagesHelper,
  getImageByIdHelper,
  getImagesByObjectIdHelper,
} from "../utils/getImages";

export const getAllImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const images = await getAllImagesHelper();
    if (!images) {
      res.status(404).json({ message: "Keine Bilder gefunden" });
      return;
    }
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({
      message: "Fehler beim Abrufen der Bilder",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getImageById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const image = await getImageByIdHelper(req.params.id);

    if (!image) {
      res.status(404).json({ message: "Bild nicht gefunden" });
      return;
    }

    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({
      message: "Fehler beim Abrufen des Bildes",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};


export const getImagesByObjectId = async (
  req: Request,
  res: Response
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
      res.status(404).json({ message: "Объект недвижимости не найден" });
      return;
    }

    // All images of the object
    const allImages = await ImagesModel.find({
      realEstateObject: objectId,
    });

    if (!allImages || allImages.length === 0) {
      console.log(`ℹ️ Изображения не найдены для объекта ${objectId}, возвращаем пустой массив`);

      //  Clearing the images array in an object
      if (realEstateObject.images && realEstateObject.images.length > 0) {
        console.log('🔄 Очищаем массив images в объекте недвижимости');
        realEstateObject.images = [];
        await realEstateObject.save();
      }

      // Anti-caching headers
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });

      res.status(200).json([]); // Возвращаем пустой массив
      return;
    }

    // Sort images according to order in the object
    let sortedImages = [...allImages];

    if (realEstateObject.images && realEstateObject.images.length > 0) {
      console.log('Сортируем изображения согласно порядку в БД:', realEstateObject.images);
      
      // Filter non-existent IDs from images array
      const validImageIds: any[] = [];
      const orderedImages: any[] = [];

      // Checking each ID in the images array of an object
      for (const imageId of realEstateObject.images) {
        const image = allImages.find(
          (img) =>
            (img._id && img._id.toString() === imageId.toString()) ||
            (img.id && img.id.toString() === imageId.toString())
        );
        
        if (image) {
          orderedImages.push(image);
          validImageIds.push(imageId);
        } else {
          console.log(`⚠️ Изображение с ID ${imageId} не найдено в коллекции, удаляем из массива`);
        }
      }

      // If the array has changed, update the object
      if (validImageIds.length !== realEstateObject.images.length) {
        console.log('🔄 Обновляем массив images в объекте, удаляя несуществующие ID');
        realEstateObject.images = validImageIds;
        await realEstateObject.save();
      }

      // Adding images that are not in the order list
      allImages.forEach((image) => {
        const imageId = image._id || image.id;
        const isAlreadyAdded = orderedImages.some(
          (orderedImg) =>
            (orderedImg._id &&
              orderedImg._id.toString() === imageId.toString()) ||
            (orderedImg.id && orderedImg.id.toString() === imageId.toString())
        );
        if (!isAlreadyAdded) {
          orderedImages.push(image);
        }
      });

      sortedImages = orderedImages;
      console.log('Изображения отсортированы:', sortedImages.map(img => img._id));
    } else {
      // If the order is not specified, sort by type (main first, then the rest)
      sortedImages.sort((a, b) => {
        if (a.type === "main" && b.type !== "main") return -1;
        if (a.type !== "main" && b.type === "main") return 1;
        return 0;
      });
      console.log('Сортировка по типу (main первым)');
    }

    // Add cache-busting timestamp to prevent caching
    const timestamp = Date.now();

    // transform the URL for delivery to the client
    const imagesWithTransformedUrls = sortedImages.map((img) => ({
      ...img.toObject(),
      url: `${transformBunnyUrl(img.url)}?t=${timestamp}`,
    }));

    // Anti-caching headers
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${timestamp}"`
    });

    console.log('Отправляем отсортированные изображения клиенту');
    res.status(200).json(imagesWithTransformedUrls);
  } catch (error) {
    console.error('Ошибка при получении изображений по objectId:', error);
    res.status(500).json({
      message: "Fehler beim Abrufen der Bilder nach Objekt-ID",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const createImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const file = req.file;
  const localFilePath = file ? path.resolve(file.path) : "";

  try {
    const { realEstateObject, type } = req.body;

    if (!file) {
      res.status(400).json({ message: "Datei nicht hochgeladen" });
      return;
    }

    const realEstate = await RealEstateObjectsModel.findById(realEstateObject);
    if (!realEstate) {
      res.status(404).json({ message: "Objekt nicht gefunden" });
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
    console.error("Fehler beim Erstellen des Bildes:", error);

    res.status(500).json({
      message: "Fehler beim Erstellen des Bildes",
      error: errorMessage,
    });
  }
};

export const updateImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const file = req.file;
  const localFilePath = file ? path.resolve(file.path) : "";

  try {
    const existingImage = await ImagesModel.findById(req.params.id);
    if (!existingImage) {
      res.status(404).json({ message: "Bild nicht gefunden" });
      return;
    }

    let updatedData: any = { ...req.body };

    if (file) {
      const newUrl = await uploadToBunny(localFilePath, file.originalname);

      try {
        await deleteFromBunny(existingImage.url);
      } catch (cdnErr) {
        console.warn(
          "Altes Bild konnte nicht vom CDN entfernt werden:",
          cdnErr
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
      { new: true }
    );

    res.status(200).json(updatedImage);
  } catch (error: any) {
    if (file && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    res.status(500).json({
      message: "Fehler beim Aktualisieren des Bildes",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deletedImage = await ImagesModel.findByIdAndDelete(req.params.id);
    if (!deletedImage) {
      res.status(404).json({ message: "Bild nicht gefunden" });
      return;
    }

    try {
      await deleteFromBunny(deletedImage.url);
    } catch (cdnErr) {
      console.warn("Datei konnte nicht vom CDN gelöscht werden:", cdnErr);
    }

    await RealEstateObjectsModel.findByIdAndUpdate(
      deletedImage.realEstateObject,
      { $pull: { images: deletedImage._id } }
    );

    res.status(200).json({ message: "Bild entfernt" });
  } catch (error) {
    res.status(500).json({
      message: "Fehler beim Löschen des Bildes",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteImageByUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      res.status(400).json({ message: "Image URL not provided" });
      return;
    }

    console.log('🔄 Удаляем изображение по URL:', imageUrl);

    // Очищаем URL от timestamp параметров для поиска
    const cleanUrl = imageUrl.split('?')[0];
    console.log('🔍 Очищенный URL для поиска:', cleanUrl);

    const storageUrl = cleanUrl.replace(
      'https://immobilien-cdn.b-cdn.net',
      'https://storage.bunnycdn.com/immobilien-media'
    );
    console.log('🔍 Storage URL для поиска в БД:', storageUrl);

    // Find an image using a cleaned URL
    const image = await ImagesModel.findOne({ 
      $or: [
        { url: imageUrl },
        { url: cleanUrl },
        { url: storageUrl },         // Storage URL (как хранится в БД)
        { url: { $regex: cleanUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') } }
      ]
    });

    if (!image) {
      console.log('❌ Изображение не найдено по URL:', imageUrl);
      console.log('🔍 Попробованные варианты поиска:');
      console.log('  - Полный URL:', imageUrl);
      console.log('  - Очищенный CDN URL:', cleanUrl);
      console.log('  - Storage URL:', storageUrl);

      res.status(404).json({ message: "Image not found" });
      return;
    }

    console.log('✅ Найдено изображение:', image._id);
    console.log('✅ URL в БД:', image.url);    

    // Удаляем изображение из BunnyCDN
    try {
      await deleteFromBunny(image.url);
      console.log('✅ Изображение удалено из CDN');
    } catch (cdnErr) {
      console.warn("Failed to remove image from CDN:", cdnErr);
    }

    // Removing image from BunnyCDN
    await ImagesModel.findByIdAndDelete(image._id);
    console.log('✅ Изображение удалено из БД');

    // Removing Image ID from object with Verification
    const updateResult = await RealEstateObjectsModel.findByIdAndUpdate(
      image.realEstateObject, 
      { $pull: { images: image._id } },
      { new: true } // Return the updated document
    );

    if (updateResult) {
      console.log('✅ ID изображения удален из объекта недвижимости');
      console.log('📊 Оставшиеся изображения в объекте:', updateResult.images?.length || 0);
    } else {
      console.warn('⚠️ Объект недвижимости не найден при обновлении');
    }

    res.status(200).json({ 
      message: "Image successfully deleted",
      remainingImagesCount: updateResult?.images?.length || 0
    });
  } catch (error) {
    console.error("Error deleting image by URL:", error);
    res.status(500).json({
      message: "Error deleting image",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export const updateImageMetadata = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedImage = await ImagesModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedImage) {
      res.status(404).json({ message: "Image not found" });
      return;
    }

    res.status(200).json(updatedImage);
  } catch (error) {
    console.error("Error updating image metadata:", error);
    res.status(500).json({
      message: "Error updating image",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
