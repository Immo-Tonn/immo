import { Request, Response } from 'express';
import { deleteFromBunny } from '../utils/deleteImages';
import RealEstateObjectsModel from '../models/RealEstateObjectsModel';
import ImagesModel from '../models/ImagesModel';

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
    console.log('🔄 КОНТРОЛЛЕР: Получен запрос на обновление объекта');
    console.log('📋 ID объекта:', req.params.id);
    console.log('📋 Тело запроса:', JSON.stringify(req.body, null, 2));
    
    // Проверяем текущее состояние объекта до обновления
    const currentObject = await RealEstateObjectsModel.findById(req.params.id);
    console.log('📊 Текущий объект до обновления:', {
      id: currentObject?._id,
      images: currentObject?.images,
      title: currentObject?.title
    });
    
             //Валидация массива images
    if (req.body.images !== undefined) {
      if (!Array.isArray(req.body.images)) {
        console.error('❌ Поле images должно быть массивом');
        res.status(400).json({ 
          message: 'Поле images должно быть массивом',
          received: typeof req.body.images
        });
        return;
      }
      
      // Фильтр валидных ObjectId
      const validImageIds = req.body.images.filter((id: any) => {
        if (typeof id === 'string' && id.match(/^[0-9a-fA-F]{24}$/)) {
          return true;
        }
        console.warn('⚠️ Невалидный ID изображения:', id);
        return false;
      });
      
      console.log('📋 Валидные ID изображений:', validImageIds);
      req.body.images = validImageIds;
    }
    
    const updated = await RealEstateObjectsModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,
        runValidators: true
      },
    );
    
    if (!updated) {
      console.error('❌ Объект не найден для обновления');
      res.status(404).json({ message: 'Objekt nicht gefunden' });
      return;
    }
    
    console.log('📊 Объект после обновления:', {
      id: updated._id,
      images: updated.images,
      title: updated.title
    });

    // Специальная обработка обновления порядка изображений
    if (req.body.images !== undefined) {
      console.log('🔄 Обнаружено обновление порядка изображений');
      console.log('📋 Новый порядок изображений из запроса:', req.body.images);
      console.log('📋 Порядок изображений в сохраненном объекте:', updated.images);
      
    //Проверка наличия изображений в БД
      if (req.body.images.length > 0) {
        const existingImages = await ImagesModel.find({
          _id: { $in: req.body.images },
          realEstateObject: req.params.id
        });
        
        console.log('📊 Найдено изображений в БД:', existingImages.length);
        console.log('📊 Ожидалось изображений:', req.body.images.length);
        
        if (existingImages.length !== req.body.images.length) {
          console.warn('⚠️ Некоторые изображения не найдены в БД');
          
          // Фильтр только существующих изображений
         const existingImageIds = existingImages.map((img: any) => img._id);
        
         await RealEstateObjectsModel.findByIdAndUpdate(
           req.params.id,
           { images: existingImageIds },
           { new: true }
         )
         updated.images = existingImageIds;
          
          console.log('📋 Обновленный список после фильтрации:', existingImageIds);
        }
      }
      
      // Принудительное сохранение изменений
      const saveResult = await updated.save();
      console.log('📊 Результат принудительного сохранения:', {
        id: saveResult._id,
        images: saveResult.images
      });
      
      // Доп. верификация через прямой запрос к БД
      const verification = await RealEstateObjectsModel.findById(req.params.id).lean();
      console.log('🔍 Верификация через прямой запрос к БД:', {
        id: verification?._id,
        images: verification?.images
      });
      
      // Проверка на сохранение изменений 
      const expectedOrder = updated.images || [];
      const actualOrder = verification?.images || [];
      
      if (JSON.stringify(expectedOrder) === JSON.stringify(actualOrder)) {
        console.log('✅ Порядок изображений успешно сохранен в БД');
      } else {
        console.error('❌ Порядок изображений НЕ сохранился в БД!');
        console.error('Ожидаемый:', expectedOrder);
        console.error('Фактический:', actualOrder);
        
        res.status(500).json({ 
          message: 'Ошибка сохранения порядка изображений',
          expected: expectedOrder,
          actual: actualOrder
        });
        return;
      }
    }
    
    //Доп. очистка orphaned изображений
    if (req.body.images !== undefined && req.body.images.length === 0) {
      console.log('🔄 Очищаем orphaned изображения для объекта');
      
      // Поиск всех изображений, привязанных к объекту
      const orphanedImages = await ImagesModel.find({
        realEstateObject: req.params.id
      });
      
      if (orphanedImages.length > 0) {
        console.log(`🗑️ Найдено ${orphanedImages.length} orphaned изображений, удаляем их`);
        
        // Удаление каждого изображения
        for (const img of orphanedImages) {
          try {
            // Удаляем из CDN
            await deleteFromBunny(img.url);
            // Удаляем из БД
            await ImagesModel.findByIdAndDelete(img._id);
            console.log(`✅ Удалено orphaned изображение: ${img._id}`);
          } catch (deleteError) {
            console.warn(`⚠️ Ошибка при удалении orphaned изображения ${img._id}:`, deleteError);
          }
        }
      }
    }
    
    // Заголовки для предотвращения кеширования
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Last-Modified': new Date().toUTCString()
    });
    
    console.log('✅ КОНТРОЛЛЕР: Объект успешно обновлен');
    res.json(updated);
    
  } catch (error) {
    console.error('❌ КОНТРОЛЛЕР: Ошибка при обновлении объекта:', error);
    console.error('❌ Стек ошибки:', (error as Error).stack);
    res
      .status(400)
      .json({ 
        message: 'Fehler beim Aktualisieren des Objekts', 
        error: (error as Error).message,
        stack: process.env.NODE_ENV === 'development' ? (error as Error).stack : undefined
      });
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

// ДОБАВЛЕННАЯ ФУНКЦИЯ DEBUG
export const debugObjectState = async (req: Request, res: Response): Promise<void> => {
  try {
    const objectId = req.params.id;
    console.log('🔍 DEBUG: Проверка состояния объекта:', objectId);
    
    // Получаем объект
    const object = await RealEstateObjectsModel.findById(objectId).lean();
    
    // Получаем изображения
    const images = await ImagesModel.find({ realEstateObject: objectId }).lean();
    
    const result = {
      timestamp: new Date().toISOString(),
      object: {
        id: object?._id,
        title: object?.title,
        images: object?.images,
        imagesCount: object?.images?.length || 0
      },
      actualImages: images.map(img => ({
        id: img._id,
        url: img.url,
        type: img.type,
        realEstateObject: img.realEstateObject
      })),
      actualImagesCount: images.length,
      orderMatch: object?.images?.length === images.length,
      // Дополнительная информация для отладки
      imageIdsInObject: object?.images || [],
      imageIdsInCollection: images.map(img => img._id?.toString()),
      missingInObject: images
        .map(img => img._id?.toString())
        .filter(id => !object?.images?.map(objId => objId.toString()).includes(id)),
      missingInCollection: (object?.images || [])
        .map(objId => objId.toString())
        .filter(id => !images.map(img => img._id?.toString()).includes(id))
    };
    
    console.log('📊 DEBUG результат:', JSON.stringify(result, null, 2));
    
    res.json(result);
  } catch (error: unknown) {
    console.error('❌ DEBUG ошибка:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: errorMessage });
  }
};


