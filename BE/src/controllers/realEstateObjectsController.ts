
import { Request, Response } from "express";
import RealEstateObjectsModel from "../models/RealEstateObjectsModel"; // путь адаптируйте к вашей структуре

// Получить все объекты недвижимости
export const getAllObjects = async (req: Request, res: Response) => {
  try {
    const objects = await RealEstateObjectsModel.find().populate("images");
    res.json(objects);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении объектов", error });
  }
};

// Получить объект по ID
export const getObjectById = async (req: Request, res: Response) => {
  try {
    const object = await RealEstateObjectsModel.findById(req.params.id).populate("images");
    if (!object){
      res.status(404).json({ message: "Объект не найден" });
      return;
    }
    res.json(object);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении объекта", error });
  }
};

// Создать новый объект недвижимости
export const createObject = async (req: Request, res: Response) => {
  try {
    const newObject = new RealEstateObjectsModel(req.body);
    const saved = await newObject.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Ошибка при создании объекта", error });
  }
};

// Обновить объект недвижимости
export const updateObject = async (req: Request, res: Response) => {
  try {
    const updated = await RealEstateObjectsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated){
      res.status(404).json({ message: "Объект не найден" });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Ошибка при обновлении объекта", error });
  }
};

// Удалить объект недвижимости
export const deleteObject = async (req: Request, res: Response):Promise<void> => {
  try {
    const deleted = await RealEstateObjectsModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      {res.status(404).json({ message: "Объект не найден" });
    return;}
    res.json({ message: "Объект успешно удален" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении объекта", error });
  }
};
