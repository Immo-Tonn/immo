import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import ResidentialHousesModel from '../models/ResidentialHousesModel';
import RealEstateObjectsModel, {
  ObjectType,
} from '../models/RealEstateObjectsModel';

export const getAllResidentialHouses = async (req: Request, res: Response) => {
  try {
    const residentialHouses =
      await ResidentialHousesModel.find().populate('realEstateObject');
    if (!residentialHouses) {
      res.status(404).json({
        message: 'Keine Wohngebäude daten gefunden',
      });
      return;
    }
    res.status(200).json(residentialHouses);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Daten', error });
  }
};

export const getResidentialHousById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const residentialHous = await ResidentialHousesModel.findById(
      req.params.id,
    ).populate('realEstateObject');
    if (!residentialHous) {
      res.status(404).json({ message: 'Wohnhaus nicht gefunden' });
      return;
    }
    res.status(200).json(residentialHous);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Daten', error });
  }
};

export const createResidentialHous = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { realEstateObject, ...ResidentialHousesData } = req.body;

    // 1. Проверка: существует ли объект недвижимости
    const realEstate = await RealEstateObjectsModel.findById(realEstateObject);
    if (!realEstate) {
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }

    // Проверка на соответствие типа в обьекте недвижимости
    if (realEstate.type !== ObjectType.HOUSE) {
      res.status(400).json({
        message: 'Der Eigenschaftstyp stimmt nicht überein.',
      });
      return;
    }

    if (realEstate.residentialHouses) {
      res.status(400).json({
        message: 'Für dieses Objekt existiert bereits ein Wohngebäude.',
      });
      return;
    }

    // 2. Создаём новую квартиру и связываем с объектом
    const newResidentialHous = new ResidentialHousesModel({
      ...ResidentialHousesData,
      realEstateObject,
    });

    const savedResidentialHous = await newResidentialHous.save();

    // 3. Добавляем ID квартиры в объект недвижимости
    realEstate.residentialHouses = savedResidentialHous._id as Types.ObjectId;
    await realEstate.save();

    // 4. Ответ клиенту
    res.status(201).json(savedResidentialHous);
  } catch (error) {
    res.status(500).json({
      message: 'Fehler beim Erstellen des Objekts „Wohngebäude“',
      error,
    });
  }
};

export const updateResidentialHous = async (req: Request, res: Response) => {
  try {
    const updated = await ResidentialHousesModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updated) {
      res.status(404).json({
        message: 'Wohnhaus nicht gefunden',
      });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({
      message: 'Fehler beim Aktualisieren der Daten für das Wohngebäude-Objekt',
      error,
    });
  }
};

export const deleteResidentialHous = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Удаляем по ID
    const deleted = await ResidentialHousesModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deleted) {
      res.status(404).json({
        message: 'Wohnhaus daten nicht gefunden',
      });
      return;
    }

    // 2. Удаляем ID квартиры из соответствующего объекта недвижимости
    await RealEstateObjectsModel.findByIdAndUpdate(deleted.realEstateObject, {
      $unset: { residentialHouses: '' },
    });

    // 3. Ответ клиенту
    res.status(200).json({
      message: 'Zusätzliche Informationen zum Objekt Wohngebäude entfernt',
    });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen', error });
  }
};
