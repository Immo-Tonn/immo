
import { Request, Response } from 'express';
import ImagesModel from '../models/ImagesModel';
import RealEstateObjectsModel from '../models/RealEstateObjectsModel'; // если нужно будет проверять наличие объекта

//  Получить все изображения
export const getAllImages = async (req: Request, res: Response) => {
  try {
    const images = await ImagesModel.find().populate('realEstateObject');
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении изображений', error });
  }
};


// Получить изображение по ID
export const getImageById = async (req: Request, res: Response):Promise<void> => {
  try {
    const image = await ImagesModel.findById(req.params.id).populate('realEstateObject');
    if (!image) {
       res.status(404).json({ message: 'Изображение не найдено' });
       return
    }
    res.status(200).json(image);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении изображения', error });
  }
};

// Создать новое изображение
export const createImage = async (req: Request, res: Response): Promise<void> => {
    try {
      const { realEstateObject, url, type } = req.body;
  
      // 1. Проверяем, существует ли объект недвижимости
      const realEstate = await RealEstateObjectsModel.findById(realEstateObject);
      if (!realEstate) {
         res.status(404).json({ message: 'Объект недвижимости не найден' })
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
      res.status(500).json({ message: 'Ошибка при создании изображения', error });
    }
  };

// Обновить изображение

export const updateImage = async (req: Request, res: Response):Promise<void> => {
  try {
    const updatedImage = await ImagesModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedImage) {
       res.status(404).json({ message: 'Изображение не найдено' });
       return
    }
    res.status(200).json(updatedImage);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при обновлении изображения', error });
  }
};

//  Удалить изображение
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Удаляем изображение по ID
      const deletedImage = await ImagesModel.findByIdAndDelete(req.params.id);
      if (!deletedImage) {
        res.status(404).json({ message: 'Изображение не найдено' });
        return;
      }
  
      // 2. Удаляем ID изображения из соответствующего объекта недвижимости
      await RealEstateObjectsModel.findByIdAndUpdate(
        deletedImage.realEstateObject,
        { $pull: { images: deletedImage._id } } 
      );
  
      // 3. Ответ клиенту
      res.status(200).json({ message: 'Изображение удалено' });
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при удалении изображения', error });
    }
  };