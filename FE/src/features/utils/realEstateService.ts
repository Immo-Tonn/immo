// immo/FE/src/features/utils/realEstateService.ts

import axios from '@features/utils/axiosConfig';
import { IRealEstateObject, ObjectType } from './types';
import { uploadMultipleImages } from './imageService';
// import { log } from 'console';

// Create a main object property
export const createRealEstateObject = async (
  objectData: IRealEstateObject,
): Promise<string> => {
  try {
    const response = await axios.post('/objects', objectData);
    return response.data._id;
  } catch (error) {
    console.error('Fehler beim Erstellen des Immobilienobjekts:', error);
    throw error;
  }
};

// Function to clear URLs from timestamps
const cleanUrl = (url: string): string => {
  const parts = url.split('?t=');
  return parts[0] || url;
};

// Исправленная функция updateImageOrder с подробной отладкой
// Исправленная функция обновления порядка изображений
export const updateImageOrder = async (
  objectId: string,
  orderedImageUrls: string[],
): Promise<void> => {
  console.log('🔄 НАЧАЛО updateImageOrder');
  console.log('📋 objectId:', objectId);
  console.log('📋 orderedImageUrls:', orderedImageUrls);

  try {
    // КРИТИЧНО: Если массив пустой, это означает что все изображения удалены
    if (!orderedImageUrls || orderedImageUrls.length === 0) {
      console.log('📋 Массив изображений пустой - очищаем images в объекте');
      
      // Обновляем объект с пустым массивом изображений
      const updateResponse = await axios.put(`/objects/${objectId}`, {
        images: [],
      });
      
      console.log('📊 Ответ от сервера (очистка массива images):', updateResponse.data);
      console.log('✅ Массив изображений в объекте успешно очищен');
      return;
    }
    
    // Функция для безопасной очистки URL
    const cleanUrl = (url: string): string => {
      try {
        const parts = url.split('?');
        return parts[0] || url;
      } catch (err) {
        console.warn('⚠️ Ошибка при очистке URL:', url);
        return url;
      }
    };
    
    // 1. Получение всех изображений объекта
    console.log('🔍 Получаем все изображения объекта...');
    const imagesResponse = await axios.get(
      `/images/by-object?objectId=${objectId}&_t=${Date.now()}`,
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
    
    console.log('📊 Ответ от сервера (изображения):', imagesResponse.data);
    
    if (!imagesResponse.data || 
        !Array.isArray(imagesResponse.data) || 
        imagesResponse.data.length === 0) {
      console.log('ℹ️ Изображения не найдены в БД, но orderedImageUrls не пустой');
      console.log('ℹ️ Возможно, новые изображения еще не загружены, пропускаем updateImageOrder');
      return;
    }
    
    // Интерфейс для изображений из БД
    interface ImageFromDB {
      _id?: string;
      id?: string;
      url: string;
      type: string;
      realEstateObject: string;
    }
    
    const allImages: ImageFromDB[] = imagesResponse.data;
    console.log('📊 Все найденные изображения:', allImages.map(img => ({
      id: img._id || img.id,
      url: img.url,
      type: img.type
    })));
    
    // 2. Создание массива ID в правильном порядке
    console.log('🔄 Создаем массив ID в правильном порядке...');
    const orderedImageIds: string[] = [];
    
    orderedImageUrls.forEach((url, index) => {
      if (!url) {
        console.warn(`⚠️ Пустой URL на позиции ${index}`);
        return;
      }
      
      const cleanedUrl = cleanUrl(url);
      console.log(`🔍 Ищем изображение для URL ${index + 1}:`, cleanedUrl);
      
      const imageObj = allImages.find(img => {
        if (!img?.url) {
          return false;
        }
        
        const imgCleanUrl = cleanUrl(img.url);
        const match = imgCleanUrl === cleanedUrl || 
                     imgCleanUrl.includes(cleanedUrl) || 
                     cleanedUrl.includes(imgCleanUrl);
        
        console.log(`   Сравниваем с ${imgCleanUrl}: ${match}`);
        return match;
      });
      
      if (imageObj) {
        const imageId = imageObj._id || imageObj.id;
        if (imageId) {
          orderedImageIds.push(imageId);
          console.log(`✅ Найдено изображение: ${imageId} для URL: ${cleanedUrl}`);
        } else {
          console.warn(`⚠️ Найдено изображение без ID для URL: ${cleanedUrl}`);
        }
      } else {
        console.warn(`⚠️ Не найдено изображение для URL: ${cleanedUrl}`);
      }
    });
    
    // Добавляем изображения, которых нет в новом порядке
    allImages.forEach(img => {
      const imageId = img._id || img.id;
      if (imageId && !orderedImageIds.includes(imageId)) {
        orderedImageIds.push(imageId);
        console.log(`➕ Добавлено отсутствующее изображение: ${imageId}`);
      }
    });
    
    console.log('📋 Финальный порядок ID изображений:', orderedImageIds);
    
    if (orderedImageIds.length === 0) {
      console.log('ℹ️ Нет изображений для упорядочивания после сопоставления');
      // В этом случае тоже очищаем массив images в объекте
      await axios.put(`/objects/${objectId}`, { images: [] });
      console.log('✅ Массив изображений в объекте очищен (не найдено сопоставлений)');
      return;
    }
    
    // 3. Обновление типов изображений
    console.log('🔄 Обновляем типы изображений...');
    const mainImageId = orderedImageIds[0];
    
    // Сначала сбрасываем все на "additional"
    for (const img of allImages) {
      const imgId = img._id || img.id;
      if (imgId && img.type === 'main' && imgId !== mainImageId) {
        console.log(`🔄 Сбрасываем тип изображения ${imgId} с main на additional`);
        try {
          await axios.put(`/images/${imgId}`, { type: 'additional' });
          console.log(`✅ Тип изображения ${imgId} сброшен`);
        } catch (imgError: unknown) {
          console.warn(`⚠️ Ошибка при сбросе типа изображения ${imgId}:`, imgError);
        }
      }
    }
    
    // Устанавливаем главное изображение
    console.log(`🔄 Устанавливаем главное изображение: ${mainImageId}`);
    try {
      await axios.put(`/images/${mainImageId}`, { type: 'main' });
      console.log(`✅ Главное изображение установлено: ${mainImageId}`);
    } catch (imgError: unknown) {
      console.error(`❌ Ошибка при установке главного изображения:`, imgError);
      throw imgError;
    }
    
    // 4. Обновление основного объекта
    console.log('🔄 Обновляем основной объект с новым порядком изображений...');
    console.log('📋 Данные для обновления:', { images: orderedImageIds });
    
    const updateResponse = await axios.put(`/objects/${objectId}`, {
      images: orderedImageIds,
    });
    
    console.log('📊 Ответ от сервера (обновление объекта):', updateResponse.data);
    console.log('📋 Обновленный порядок в объекте:', updateResponse.data.images);
    
    // 5. Верификация результата
    console.log('🔍 Верификация результата...');
    const verificationResponse = await axios.get(`/objects/${objectId}?_t=${Date.now()}`);
    console.log('📊 Верификация - текущий порядок в БД:', verificationResponse.data.images);
    
    // Проверяем, что порядок действительно обновился
    const actualOrder: string[] = verificationResponse.data.images || [];
    const isOrderCorrect = JSON.stringify(orderedImageIds) === JSON.stringify(actualOrder);
    
    if (isOrderCorrect) {
      console.log('✅ Порядок изображений успешно обновлен и подтвержден!');
    } else {
      console.error('❌ Порядок изображений НЕ обновился в БД!');
      console.error('Ожидаемый порядок:', orderedImageIds);
      console.error('Фактический порядок:', actualOrder);
      throw new Error('Порядок изображений не был сохранен в базе данных');
    }
    
  } catch (error: unknown) {
    console.error('❌ Ошибка в updateImageOrder:', error);
    
    if (error instanceof Error) {
      console.error('❌ Сообщение ошибки:', error.message);
      console.error('❌ Стек ошибки:', error.stack);
    }
    
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: {
          data?: any;
          status?: number;
          statusText?: string;
        };
      };
      console.error('❌ HTTP статус:', axiosError.response?.status);
      console.error('❌ Детали ошибки:', axiosError.response?.data);
    }
    
    throw error;
  }
  
  console.log('✅ ЗАВЕРШЕНИЕ updateImageOrder');
};

export const createSpecificObjectData = async (
  realEstateObjectId: string,
  objectType: ObjectType,
  specificData: Record<string, any>,
): Promise<void> => {
  try {
    const data = {
      ...specificData,
      realEstateObject: realEstateObjectId,
    };

    // Select an endpoint depending on the property type
    let endpoint = '';
    switch (objectType) {
      case ObjectType.APARTMENT:
        endpoint = '/apartments';
        break;
      case ObjectType.HOUSE:
        endpoint = '/residentialHouses';
        break;
      case ObjectType.LAND:
        endpoint = '/landPlots';
        break;
      case ObjectType.COMMERCIAL:
        endpoint = '/commercial_NonResidentialBuildings';
        break;
      default:
        throw new Error('Неизвестный тип объекта');
    }

    await axios.post(endpoint, data);
  } catch (error) {
    console.error('Ошибка при создании специфических данных объекта:', error);
    throw error;
  }
};

// Full process of creating a property with image uploads
export const createCompleteRealEstateObject = async (
  objectData: IRealEstateObject,
  specificData: Record<string, any>,
  files: File[],
  onUploadProgress?: (progress: number) => void,
): Promise<string> => {
  try {
    // 1. Create the main property object
    console.log('Шаг 1: Начало создания основного объекта');
    const realEstateObjectId = await createRealEstateObject(objectData);
    console.log('Шаг 1: Основной объект создан, ID:', realEstateObjectId);

    // 2. Create specific data depending on the type
    console.log('Шаг 2: Создание специфических данных');
    await createSpecificObjectData(
      realEstateObjectId,
      objectData.type,
      specificData,
    );
    console.log('Шаг 2: Специфические данные созданы');

    // 3. Load images if any
    console.log(
      'Шаг 3: Начало загрузки изображений, количество:',
      files.length,
    );
    if (files.length > 0) {
      await uploadMultipleImages(files, realEstateObjectId, onUploadProgress);
    }
    console.log('Шаг 3: Изображения загружены');

    // Return the ID of the created property
    return realEstateObjectId;
  } catch (error: any) {
    console.error('Ошибка при создании объекта недвижимости:', error);
    console.error(
      'Детали ошибки:',
      error.response?.data || error.message || 'Неизвестная ошибка',
    );
    console.error('Код ошибки:', error.code);
    console.error('Статус:', error.response?.status);
    throw error;
  }
};

// Loading object data for editing
export const fetchObjectForEdit = async (
  objectId: string,
): Promise<{
  objectData: any;
  specificData: any;
  images: string[];
  videos: any[];
}> => {
  try {
    console.log('Загружаем данные объекта для редактирования:', objectId);

    // Getting basic object data
    const objectResponse = await axios.get(`/objects/${objectId}`);
    const objectData = objectResponse.data;
    console.log('Основные данные загружены:', objectData);

    // Getting images
    let images: string[] = [];
    try {
      const imagesResponse = await axios.get(
        `/images/by-object?objectId=${objectId}`,
      );
      if (imagesResponse.data && Array.isArray(imagesResponse.data)) {
        images = imagesResponse.data.map((img: any) => img.url);
      }
      console.log('Изображения загружены:', images);
    } catch (imageError) {
      console.warn('Не удалось загрузить изображения:', imageError);
    }

    // Getting video
    let videos: any[] = [];
    try {
      const videosResponse = await axios.get(
        `/videos/by-object?objectId=${objectId}`,
      );
      if (videosResponse.data && Array.isArray(videosResponse.data)) {
        videos = videosResponse.data;
      }
      console.log('Видео загружены:', videos);
    } catch (videoError) {
      console.warn('Не удалось загрузить видео:', videoError);
    }

    // Getting specific data depending on the object type
    let specificData = null;
    try {
      // Checking if specific data is already populated
      switch (objectData.type) {
        case ObjectType.APARTMENT:
          if (objectData.apartments) {
            if (
              typeof objectData.apartments === 'object' &&
              objectData.apartments._id
            ) {
              specificData = objectData.apartments;
            } else if (typeof objectData.apartments === 'string') {
              const specificResponse = await axios.get(
                `/apartments/${objectData.apartments}`,
              );
              specificData = specificResponse.data;
            }
          }
          break;
        case ObjectType.HOUSE:
          if (objectData.residentialHouses) {
            if (
              typeof objectData.residentialHouses === 'object' &&
              objectData.residentialHouses._id
            ) {
              specificData = objectData.residentialHouses;
            } else if (typeof objectData.residentialHouses === 'string') {
              const specificResponse = await axios.get(
                `/residentialHouses/${objectData.residentialHouses}`,
              );
              specificData = specificResponse.data;
            }
          }
          break;
        case ObjectType.LAND:
          if (objectData.landPlots) {
            if (
              typeof objectData.landPlots === 'object' &&
              objectData.landPlots._id
            ) {
              specificData = objectData.landPlots;
            } else if (typeof objectData.landPlots === 'string') {
              const specificResponse = await axios.get(
                `/landPlots/${objectData.landPlots}`,
              );
              specificData = specificResponse.data;
            }
          }
          break;
        case ObjectType.COMMERCIAL:
          if (objectData.commercial_NonResidentialBuildings) {
            if (
              typeof objectData.commercial_NonResidentialBuildings ===
                'object' &&
              objectData.commercial_NonResidentialBuildings._id
            ) {
              specificData = objectData.commercial_NonResidentialBuildings;
            } else if (
              typeof objectData.commercial_NonResidentialBuildings === 'string'
            ) {
              const specificResponse = await axios.get(
                `/commercial_NonResidentialBuildings/${objectData.commercial_NonResidentialBuildings}`,
              );
              specificData = specificResponse.data;
            }
          }
          break;
      }
      console.log('Специфические данные загружены:', specificData);
    } catch (specificError) {
      console.warn('Не удалось загрузить специфические данные:', specificError);
    }

    return {
      objectData,
      specificData,
      images,
      videos,
    };
  } catch (error) {
    console.error(
      'Ошибка при загрузке данных объекта для редактирования:',
      error,
    );
    throw error;
  }
};

// Function to delete an image from the server by ID
export const deleteImageFromServer = async (imageId: string): Promise<void> => {
  try {
    await axios.delete(`/images/${imageId}`);
    console.log('Изображение удалено по ID:', imageId);
  } catch (error) {
    console.error('Ошибка при удалении изображения с сервера:', error);
    throw error;
  }
};

// Function to update specific data depending on the object type
const updateSpecificObjectData = async (
  realEstateObjectId: string,
  objectType: ObjectType,
  specificData: Record<string, any>,
): Promise<void> => {
  try {
    console.log('Обновляем специфические данные для типа:', objectType);

    // Get the current property to get the ID of the specific data
    const objectResponse = await axios.get(`/objects/${realEstateObjectId}`);
    const objectData = objectResponse.data;
    let specificId: string | null = null;
    let endpoint = '';

    // Determine the ID of the specific data and the endpoint depending on the object type
    switch (objectType) {
      case ObjectType.APARTMENT:
        if (
          typeof objectData.apartments === 'object' &&
          objectData.apartments._id
        ) {
          specificId = objectData.apartments._id;
        } else if (typeof objectData.apartments === 'string') {
          specificId = objectData.apartments;
        }
        endpoint = '/apartments';
        break;
      case ObjectType.HOUSE:
        if (
          typeof objectData.residentialHouses === 'object' &&
          objectData.residentialHouses._id
        ) {
          specificId = objectData.residentialHouses._id;
        } else if (typeof objectData.residentialHouses === 'string') {
          specificId = objectData.residentialHouses;
        }
        endpoint = '/residentialHouses';
        break;
      case ObjectType.LAND:
        if (
          typeof objectData.landPlots === 'object' &&
          objectData.landPlots._id
        ) {
          specificId = objectData.landPlots._id;
        } else if (typeof objectData.landPlots === 'string') {
          specificId = objectData.landPlots;
        }
        endpoint = '/landPlots';
        break;
      case ObjectType.COMMERCIAL:
        if (
          typeof objectData.commercial_NonResidentialBuildings === 'object' &&
          objectData.commercial_NonResidentialBuildings._id
        ) {
          specificId = objectData.commercial_NonResidentialBuildings._id;
        } else if (
          typeof objectData.commercial_NonResidentialBuildings === 'string'
        ) {
          specificId = objectData.commercial_NonResidentialBuildings;
        }
        endpoint = '/commercial_NonResidentialBuildings';
        break;
      default:
        throw new Error('Неизвестный тип объекта');
    }

    console.log('ID специфических данных:', specificId, 'Эндпоинт:', endpoint);

    if (specificId) {
      //Update existing specific data
      console.log('Обновляем существующие специфические данные');
      await axios.put(`${endpoint}/${specificId}`, specificData);
    } else {
      // Создаем новые специфические данные (если их не было)
      console.log('Создаем новые специфические данные');
      const data = {
        ...specificData,
        realEstateObject: realEstateObjectId,
      };
      const response = await axios.post(endpoint, data);

      // Update the main property with a new specific data ID
      const updateData: any = {};
      switch (objectType) {
        case ObjectType.APARTMENT:
          updateData.apartments = response.data._id;
          break;
        case ObjectType.HOUSE:
          updateData.residentialHouses = response.data._id;
          break;
        case ObjectType.LAND:
          updateData.landPlots = response.data._id;
          break;
        case ObjectType.COMMERCIAL:
          updateData.commercial_NonResidentialBuildings = response.data._id;
          break;
      }
      await axios.put(`/objects/${realEstateObjectId}`, updateData);
    }
  } catch (error) {
    console.error('Ошибка при обновлении специфических данных объекта:', error);
    throw error;
  }
};

// Function to update object
// Исправленная функция обновления объекта недвижимости
export const updateCompleteRealEstateObject = async (
  objectId: string,
  objectData: any,
  specificData: Record<string, any>,
  newFiles: File[],
  existingImages: string[],
  onUploadProgress?: (progress: number) => void,
): Promise<void> => {
  try {
    console.log('Начинаем обновление объекта:', objectId);
    console.log('Порядок существующих изображений:', existingImages);

    // 1. Обновление основного объекта
    console.log('Шаг 1: Обновление основного объекта');
    await axios.put(`/objects/${objectId}`, objectData);
    console.log('Шаг 1: Основной объект обновлен');

    // 2. Обновление специфических данных
    console.log('Шаг 2: Обновление специфических данных');
    await updateSpecificObjectData(objectId, objectData.type, specificData);
    console.log('Шаг 2: Специфические данные обновлены');

    // 3. Управление изображениями
    console.log('Шаг 3: Управление изображениями');

    // 3.1 Получение текущих изображений объекта
    let currentImages: any[] = [];
    try {
      const imagesResponse = await axios.get(
        `/images/by-object?objectId=${objectId}`,
      );
      if (imagesResponse.data && Array.isArray(imagesResponse.data)) {
        currentImages = imagesResponse.data;
        console.log('Текущие изображения в БД:', currentImages.length);
      }
    } catch (error: any) {
      if (error.response?.status === 404 || 
          error.response?.data?.message?.includes('Keine Bilder')) {
        console.log('ℹ️ Изображения не найдены в БД (это нормально)');
        currentImages = [];
      } else {
        console.warn('⚠️ Не удалось получить текущие изображения:', error);
        currentImages = [];
      }     
    }

    // 3.2 Поиск изображений для удаления
    const existingCleanUrls = existingImages.map(url => cleanUrl(url));
    const imagesToDelete = currentImages.filter(
      img => !existingCleanUrls.includes(cleanUrl(img.url)),
    );

    console.log(`Найдено ${imagesToDelete.length} изображений для удаления`);

    // 3.3 Удаление ненужных изображений
    for (const imageToDelete of imagesToDelete) {
      try {
        console.log('Удаляем изображение по ID:', imageToDelete._id);
        await deleteImageFromServer(imageToDelete._id);
        console.log('Изображение удалено:', imageToDelete.url);
      } catch (error) {
        console.warn(
          'Ошибка при удалении изображения:',
          imageToDelete._id,
          error,
        );
      }
    }

    // 3.4 Загрузка новых изображений
    if (newFiles.length > 0) {
      console.log('Загружаем новые изображения, количество:', newFiles.length);
      await uploadMultipleImages(newFiles, objectId, onUploadProgress);
      console.log('Новые изображения загружены');
    }

    // 3.5 КРИТИЧНО: Всегда обновляем порядок изображений в объекте
    // Это нужно делать даже если existingImages пустой массив
    console.log('Обновляем порядок изображений в объекте...');
    
    if (existingImages.length === 0) {
      // Если изображений не осталось, очищаем массив images в объекте
      console.log('📋 Очищаем массив изображений в объекте (все изображения удалены)');
      await axios.put(`/objects/${objectId}`, { images: [] });
      console.log('✅ Массив изображений в объекте очищен');
    } else {
      // Если есть изображения, обновляем их порядок
      await updateImageOrder(objectId, existingImages);
      console.log('✅ Порядок изображений обновлен');
    }

    console.log('✅ Обновление объекта завершено успешно');
  } catch (error: any) {
    console.error('❌ Ошибка при обновлении объекта недвижимости:', error);
    console.error(
      'Детали ошибки:',
      error.response?.data || error.message || 'Неизвестная ошибка',
    );
    throw error;
  }
};
