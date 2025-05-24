import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import RealEstateObjectsModel, {
  ObjectType,
} from '../models/RealEstateObjectsModel';
import Commercial_NonResidentialBuildingsModel from '../models/Commercial_NonResidentialBuildingsModel';

export const getAllCommercial_NonResidentialBuildings = async (
  req: Request,
  res: Response,
) => {
  try {
    const commercial_NonResidentialBuildings =
      await Commercial_NonResidentialBuildingsModel.find().populate(
        'realEstateObject',
      );
    if (!commercial_NonResidentialBuildings) {
      res.status(404).json({
        message: 'Keine Gewerbe-/Nichtwohngebäude daten gefunden',
      });
      return;
    }
    res.status(200).json(commercial_NonResidentialBuildings);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Daten', error });
  }
};

export const getCommercial_NonResidentialBuildingById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const commercial_NonResidentialBuilding =
      await Commercial_NonResidentialBuildingsModel.findById(
        req.params.id,
      ).populate('realEstateObject');
    if (!commercial_NonResidentialBuilding) {
      res
        .status(404)
        .json({ message: 'Gewerbe-/Nichtwohngebäude nicht gefunden' });
      return;
    }
    res.status(200).json(commercial_NonResidentialBuilding);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Daten', error });
  }
};

export const createCommercial_NonResidentialBuildings = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { realEstateObject, ...commercial_NonResidentialBuildingsData } =
      req.body;

    // 1. Проверка: существует ли объект недвижимости
    const realEstate = await RealEstateObjectsModel.findById(realEstateObject);
    if (!realEstate) {
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }

    // Проверка на соответствие типа в обьекте недвижимости
    if (realEstate.type !== ObjectType.COMMERCIAL) {
      res.status(400).json({
        message: 'Der Eigenschaftstyp stimmt nicht überein.',
      });
      return;
    }

    if (realEstate.commercial_NonResidentialBuildings) {
      res.status(400).json({
        message: 'Für dieses Objekt existiert bereits ein Wohngebäude.',
      });
      return;
    }

    // 2. Создаём новую квартиру и связываем с объектом
    const newCommercial_NonResidentialBuilding =
      new Commercial_NonResidentialBuildingsModel({
        ...commercial_NonResidentialBuildingsData,
        realEstateObject,
      });

    const savedCommercial_NonResidentialBuilding =
      await newCommercial_NonResidentialBuilding.save();

    // 3. Добавляем ID квартиры в объект недвижимости
    realEstate.commercial_NonResidentialBuildings =
      savedCommercial_NonResidentialBuilding._id as Types.ObjectId;
    await realEstate.save();

    // 4. Ответ клиенту
    res.status(201).json(savedCommercial_NonResidentialBuilding);
  } catch (error) {
    res.status(500).json({
      message: 'Fehler beim Erstellen des Objekts „Gewerbe-/Nichtwohngebäude“',
      error,
    });
  }
};

export const updateCommercial_NonResidentialBuildings = async (
  req: Request,
  res: Response,
) => {
  try {
    const updated =
      await Commercial_NonResidentialBuildingsModel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
    if (!updated) {
      res.status(404).json({
        message: 'Gewerbe-/Nichtwohngebäude nicht gefunden',
      });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({
      message:
        'Fehler beim Aktualisieren der Daten für das Gewerbe-/Nichtwohngebäude-Objekt',
      error,
    });
  }
};

export const deleteCommercial_NonResidentialBuilding = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Удаляем по ID
    const deletedCommercial_NonResidentialBuilding =
      await Commercial_NonResidentialBuildingsModel.findByIdAndDelete(
        req.params.id,
      );
    if (!deletedCommercial_NonResidentialBuilding) {
      res.status(404).json({
        message: 'Gewerbe-/Nichtwohngebäude daten nicht gefunden',
      });
      return;
    }

    // 2. Удаляем ID квартиры из соответствующего объекта недвижимости
    await RealEstateObjectsModel.findByIdAndUpdate(
      deletedCommercial_NonResidentialBuilding.realEstateObject,
      { $unset: { commercial_NonResidentialBuildings: '' } },
    );

    // 3. Ответ клиенту
    res.status(200).json({
      message:
        'Zusätzliche Informationen zum Objekt Gewerbe-/Nichtwohngebäude entfernt',
    });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen', error });
  }
};
