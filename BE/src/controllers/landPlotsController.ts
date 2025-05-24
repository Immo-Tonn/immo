import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import RealEstateObjectsModel, {
  ObjectType,
} from '../models/RealEstateObjectsModel';
import LandPlotsModel from '../models/LandPlotsModel';

export const getAllLandPlots = async (req: Request, res: Response) => {
  try {
    const landPlots = await LandPlotsModel.find().populate('realEstateObject');
    if (!landPlots) {
      res.status(404).json({
        message: 'Keine Grundstücke daten gefunden',
      });
      return;
    }
    res.status(200).json(landPlots);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Daten', error });
  }
};

export const getLandPlotById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const landPlot = await LandPlotsModel.findById(req.params.id).populate(
      'realEstateObject',
    );
    if (!landPlot) {
      res.status(404).json({ message: 'Grundstück nicht gefunden' });
      return;
    }
    res.status(200).json(landPlot);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Daten', error });
  }
};

export const createLandPlot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { realEstateObject, ...LandPlotsData } = req.body;

    // 1. Проверка: существует ли объект недвижимости
    const realEstate = await RealEstateObjectsModel.findById(realEstateObject);
    if (!realEstate) {
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }

    // Проверка на соответствие типа в обьекте недвижимости
    if (realEstate.type !== ObjectType.LAND) {
      res.status(400).json({
        message: 'Der Eigenschaftstyp stimmt nicht überein.',
      });
      return;
    }

    if (realEstate.landPlots) {
      res.status(400).json({
        message: 'Für dieses Objekt existiert bereits ein Wohngebäude.',
      });
      return;
    }

    // 2. Создаём новую квартиру и связываем с объектом
    const newLandPlot = new LandPlotsModel({
      ...LandPlotsData,
      realEstateObject,
    });

    const savedLandPlot = await newLandPlot.save();

    // 3. Добавляем ID квартиры в объект недвижимости
    realEstate.landPlots = savedLandPlot._id as Types.ObjectId;
    await realEstate.save();

    // 4. Ответ клиенту
    res.status(201).json(savedLandPlot);
  } catch (error) {
    res.status(500).json({
      message: 'Fehler beim Erstellen des Objekts „Grundstücke“',
      error,
    });
  }
};

export const updateLandPlots = async (req: Request, res: Response) => {
  try {
    const updated = await LandPlotsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updated) {
      res.status(404).json({
        message: 'Grundstück nicht gefunden',
      });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({
      message: 'Fehler beim Aktualisieren der Daten für das Grundstücke-Objekt',
      error,
    });
  }
};

export const deleteLandPlot = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Удаляем по ID
    const deleted = await LandPlotsModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({
        message: 'Grundstück daten nicht gefunden',
      });
      return;
    }

    // 2. Удаляем ID квартиры из соответствующего объекта недвижимости
    await RealEstateObjectsModel.findByIdAndUpdate(deleted.realEstateObject, {
      $unset: { landPlots: '' },
    });

    // 3. Ответ клиенту
    res.status(200).json({
      message: 'Zusätzliche Informationen zum Objekt Grundstück entfernt',
    });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen', error });
  }
};
