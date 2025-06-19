import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import ApartmentsModel from '../models/ApartmentsModel';
import RealEstateObjectsModel, {
  ObjectType,
} from '../models/RealEstateObjectsModel';

export const getAllApartments = async (req: Request, res: Response) => {
  try {
    const apartments =
      await ApartmentsModel.find().populate('realEstateObject');
    if (!apartments) {
      res.status(404).json({ message: 'Keine Wohnungsdaten gefunden' });
      return;
    }
    res.status(200).json(apartments);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Daten', error });
  }
};

export const getApartmentsById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const apartment = await ApartmentsModel.findById(req.params.id).populate(
      'realEstateObject',
    );
    if (!apartment) {
      res.status(404).json({ message: 'Wohnungsobjektdaten nicht gefunden' });
      return;
    }
    res.status(200).json(apartment);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Daten', error });
  }
};

export const createApartment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { realEstateObject, ...apartmentData } = req.body;

    const realEstate = await RealEstateObjectsModel.findById(realEstateObject);
    if (!realEstate) {
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }

    if (realEstate.type !== ObjectType.APARTMENT) {
      res.status(400).json({
        message: 'Der Eigenschaftstyp stimmt nicht überein.',
      });
      return;
    }

    if (realEstate.apartments) {
      res.status(400).json({
        message: 'Für dieses Objekt existiert bereits ein Wohngebäude.',
      });
      return;
    }

    const newApartment = new ApartmentsModel({
      ...apartmentData,
      realEstateObject,
    });

    const savedApartment = await newApartment.save();

    realEstate.apartments = savedApartment._id as Types.ObjectId;
    await realEstate.save();

    res.status(201).json(savedApartment);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Fehler beim Erstellen des Objekts „Wohnung“', error });
  }
};

export const updateApartment = async (req: Request, res: Response) => {
  try {
    const updated = await ApartmentsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    if (!updated) {
      res.status(404).json({ message: 'Wohnungsobjektdaten nicht gefunden' });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({
      message: 'Fehler beim Aktualisieren der Daten für das Apartment-Objekt',
      error,
    });
  }
};

export const deleteApartment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const deletedApartment = await ApartmentsModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedApartment) {
      res.status(404).json({ message: 'Wohnungsobjektdaten nicht gefunden' });
      return;
    }

    await RealEstateObjectsModel.findByIdAndUpdate(
      deletedApartment.realEstateObject,
      { $unset: { apartments: '' } },
    );

    res.status(200).json({
      message: 'Zusätzliche Informationen zum Objekt Wohnung entfernt',
    });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen', error });
  }
};
