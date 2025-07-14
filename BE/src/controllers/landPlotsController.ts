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

    console.log('🔍 DEBUG createLandPlot: Получен запрос');
    console.log('🔍 DEBUG req.body:', JSON.stringify(req.body, null, 2));

    const { realEstateObject, ...LandPlotsData } = req.body;

    console.log('🔍 DEBUG realEstateObject ID:', realEstateObject);
    console.log('🔍 DEBUG LandPlotsData:', JSON.stringify(LandPlotsData, null, 2));
    console.log('🔍 DEBUG landPlottype в данных:', LandPlotsData.landPlottype);


    // 1. Check: property exist?
    const realEstate = await RealEstateObjectsModel.findById(realEstateObject);
    if (!realEstate) {
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }

    // Check for type compliance in a real estate object
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

    // 2. Create a new Plot and link it to the object
    const newLandPlot = new LandPlotsModel({
      ...LandPlotsData,
      realEstateObject,
    });

    console.log('🔍 DEBUG newLandPlot до сохранения:', JSON.stringify(newLandPlot.toObject(), null, 2));
    console.log('🔍 DEBUG newLandPlot.landPlottype:', newLandPlot.landPlottype);    

    const savedLandPlot = await newLandPlot.save();

    console.log('🔍 DEBUG savedLandPlot после сохранения:', JSON.stringify(savedLandPlot.toObject(), null, 2));
    console.log('🔍 DEBUG savedLandPlot.landPlottype:', savedLandPlot.landPlottype);    

    // 3. Adding a Plot ID to a Property
    realEstate.landPlots = savedLandPlot._id as Types.ObjectId;
    await realEstate.save();

    // 4. Reply to client
    console.log('🔍 DEBUG Отправляем ответ клиенту:', savedLandPlot);
    res.status(201).json(savedLandPlot);
  } catch (error) {
    console.error('🔍 DEBUG Ошибка в createLandPlot:', error);
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
    const deleted = await LandPlotsModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({
        message: 'Grundstück daten nicht gefunden',
      });
      return;
    }

    await RealEstateObjectsModel.findByIdAndUpdate(deleted.realEstateObject, {
      $unset: { landPlots: '' },
    });

    res.status(200).json({
      message: 'Zusätzliche Informationen zum Objekt Grundstück entfernt',
    });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen', error });
  }
};
