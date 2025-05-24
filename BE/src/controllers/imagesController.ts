import { Request, Response } from 'express';
import ImagesModel from '../models/ImagesModel';
import RealEstateObjectsModel from '../models/RealEstateObjectsModel';
import { uploadToBunny } from '../utils/uploadImages';
import { deleteFromBunny } from '../utils/deleteImages';
import path from 'path';
import fs from 'fs';
import {
  getAllImagesHelper,
  getImageByIdHelper,
  getImagesByObjectIdHelper,
} from '../utils/getImages';

export const getAllImages = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const images = await getAllImagesHelper();
    if (!images) {
      res.status(404).json({ message: 'Keine Bilder gefunden' });
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

    const images = await getImagesByObjectIdHelper(objectId);

    if (!images) {
      res
        .status(404)
        .json({ message: 'Keine Bilder für dieses Objekt gefunden' });
      return;
    }

    res.status(200).json(images);
  } catch (error) {
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
