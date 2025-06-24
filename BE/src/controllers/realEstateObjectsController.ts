import { Request, Response } from 'express';
import RealEstateObjectsModel from '../models/RealEstateObjectsModel';

export const getAllObjects = async (req: Request, res: Response) => {
  try {
    const objects = await RealEstateObjectsModel.find()
      .populate('apartments')
      .populate('commercial_NonResidentialBuildings')
      .populate('landPlots')
      .populate('residentialHouses');
    if (!objects) {
      res.status(404).json({ message: 'Keine Objekte gefunden' });
      return;
    }
    res.status(200).json(objects);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Objekte', error });
  }
};

export const getObjectById = async (req: Request, res: Response) => {
  try {
    const object = await RealEstateObjectsModel.findById(req.params.id)
      .populate('apartments')
      .populate('commercial_NonResidentialBuildings')
      .populate('landPlots')
      .populate('residentialHouses');
    if (!object) {
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }
    res.json(object);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Objekte', error });
  }
};

export const createObject = async (req: Request, res: Response) => {
  try {
    const newObject = new RealEstateObjectsModel(req.body);
    const saved = await newObject.save();
    res.status(201).json(saved);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Fehler beim Erstellen des Objekts', error });
  }
};

export const updateObject = async (req: Request, res: Response) => {
  try {
    const updated = await RealEstateObjectsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updated) {
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }
    res.json(updated);
  } catch (error) {
    res
      .status(400)
      .json({ message: 'Fehler beim Aktualisieren des Objekts', error });
  }
};

export const deleteObject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const deleted = await RealEstateObjectsModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deleted) {
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }
    res.json({ message: 'Das Objekt wurde erfolgreich gelöscht.' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen des Objekts', error });
  }
};
