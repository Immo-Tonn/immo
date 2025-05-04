import { Request, Response } from "express";
import ImagesModel from "../models/ImagesModel";
import RealEstateObjectsModel from "../models/RealEstateObjectsModel";

export const getAllImages = async (req: Request, res: Response) => {
  try {
    const images = await ImagesModel.find().populate("realEstateObject");
    if (!images) {
      res.status(404).json({ message: "Keine Bilder gefunden" });
      return;
    }
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Abrufen der Bilder", error });
  }
};

export const getImageById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const image = await ImagesModel.findById(req.params.id).populate(
      "realEstateObject"
    );
    if (!image) {
      res.status(404).json({ message: "Bild nicht gefunden" });
      return;
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Abrufen des Bildes", error });
  }
};

export const createImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { realEstateObject, url, type } = req.body;

    // 1. Проверяем, существует ли объект недвижимости
    const realEstate = await RealEstateObjectsModel.findById(realEstateObject);
    if (!realEstate) {
      res.status(404).json({ message: "Objekt nicht gefunden" });
      return;
    }

    // 2. Создаем новое изображение
    const newImage = new ImagesModel({
      realEstateObject,
      url,
      type,
    });
    const savedImage = await newImage.save();

    // 3. Добавляем изображение в объект недвижимости
    realEstate.images?.push(savedImage.id);
    await realEstate.save();

    // 4. Возвращаем успешный ответ
    res.status(201).json(savedImage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Erstellen des Bildes", error });
  }
};

export const updateImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updatedImage = await ImagesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!updatedImage) {
      res.status(404).json({ message: "Bild nicht gefunden" });
      return;
    }
    res.status(200).json(updatedImage);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fehler beim Aktualisieren des Bildes", error });
  }
};

export const deleteImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // 1. Удаляем изображение по ID
    const deletedImage = await ImagesModel.findByIdAndDelete(req.params.id);
    if (!deletedImage) {
      res.status(404).json({ message: "Bild nicht gefunden" });
      return;
    }

    // 2. Удаляем ID изображения из соответствующего объекта недвижимости
    await RealEstateObjectsModel.findByIdAndUpdate(
      deletedImage.realEstateObject,
      { $pull: { images: deletedImage._id } }
    );

    // 3. Ответ клиенту
    res.status(200).json({ message: "Bild entfernt" });
  } catch (error) {
    res.status(500).json({ message: "Fehler beim Löschen des Bildes", error });
  }
};
