// immo/FE/src/pages/AdminObject/realEstateService.ts
import axios from '@features/utils/axiosConfig';
import { IRealEstateObject, ObjectType } from './types';
import { uploadMultipleImages } from './imageService';

// Создание основного объекта недвижимости
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

// Функция для очистки URL от timestamps
const cleanUrl = (url: string): string => {
  const parts = url.split('?t=');
  return parts[0] || url;
};

// Функция для обновления порядка изображений
export const updateImageOrder = async (
  objectId: string,
  orderedImageUrls: string[],
): Promise<void> => {
  try {
    console.log('Обновляем порядок изображений для объекта:', objectId);
    console.log('Новый порядок URL:', orderedImageUrls);

    // Получение всех изображений объекта
    const imagesResponse = await axios.get(
      `/images/by-object?objectId=${objectId}`,
    );
    if (!imagesResponse.data || !Array.isArray(imagesResponse.data)) {
      console.warn('Изображения не найдены');
      return;
    }
    const allImages = imagesResponse.data;
    console.log('Все найденные изображения:', allImages);

    // Создание массива ID изображений в правильном порядке
    const orderedImageIds: string[] = [];

    // Сначала добавляем существующие изображения в нужном порядке
    orderedImageUrls.forEach(url => {
      const cleanedUrl = cleanUrl(url);
      const imageObj = allImages.find(img => cleanUrl(img.url) === cleanedUrl);
      if (imageObj) {
        orderedImageIds.push(imageObj._id || imageObj.id);
      }
    });

    // Затем добавляем новые изображения (которых нет в orderedImageUrls)
    allImages.forEach(img => {
      const imageId = img._id || img.id;
      if (!orderedImageIds.includes(imageId)) {
        orderedImageIds.push(imageId);
      }
    });

    console.log('Финальный порядок ID изображений:', orderedImageIds);

    // Обновляем тип первого изображения на "main"
    if (orderedImageIds.length > 0) {
      const mainImageId = orderedImageIds[0];

      // Сначала сбрасываем все изображения на "additional"
      for (const img of allImages) {
        if (img.type === 'main') {
          try {
            await axios.put(`/images/${img._id || img.id}`, {
              type: 'additional',
            });
          } catch (error) {
            console.warn('Ошибка при сбросе типа изображения:', error);
          }
        }
      }

      // Устанавливаем первое изображение как главное
      try {
        await axios.put(`/images/${mainImageId}`, {
          type: 'main',
        });
        console.log('Главное изображение установлено:', mainImageId);
      } catch (error) {
        console.warn('Ошибка при установке главного изображения:', error);
      }
    }

    // Обновляем основной объект с новым порядком изображений
    await axios.put(`/objects/${objectId}`, {
      images: orderedImageIds,
    });

    console.log('Порядок изображений успешно обновлен');
  } catch (error) {
    console.error('Ошибка при обновлении порядка изображений:', error);
    throw error;
  }
};

// Создание специфических данных в зависимости от типа объекта
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

    // Выбор эндпоинта в зависимости от типа объекта
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

// Полный процесс создания объекта недвижимости с загрузкой изображений
export const createCompleteRealEstateObject = async (
  objectData: IRealEstateObject,
  specificData: Record<string, any>,
  files: File[],
  onUploadProgress?: (progress: number) => void,
): Promise<string> => {
  try {
    // 1. Создаем основной объект недвижимости
    console.log('Шаг 1: Начало создания основного объекта');
    const realEstateObjectId = await createRealEstateObject(objectData);
    console.log('Шаг 1: Основной объект создан, ID:', realEstateObjectId);

    // 2. Создаем специфические данные в зависимости от типа
    console.log('Шаг 2: Создание специфических данных');
    await createSpecificObjectData(
      realEstateObjectId,
      objectData.type,
      specificData,
    );
    console.log('Шаг 2: Специфические данные созданы');

    // 3. Загружаем изображения, если они есть
    console.log(
      'Шаг 3: Начало загрузки изображений, количество:',
      files.length,
    );
    if (files.length > 0) {
      await uploadMultipleImages(files, realEstateObjectId, onUploadProgress);
    }
    console.log('Шаг 3: Изображения загружены');

    // Возвращаем ID созданного объекта
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

// Загрузка данных объекта для редактирования
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

    // Получаем основные данные объекта
    const objectResponse = await axios.get(`/objects/${objectId}`);
    const objectData = objectResponse.data;
    console.log('Основные данные загружены:', objectData);

    // Получаем изображения
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

    // Получаем видео
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

    // Получаем специфические данные в зависимости от типа объекта
    let specificData = null;
    try {
      // Проверяем, популированы ли уже специфические данные
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

// Функция для удаления изображения с сервера по ID
export const deleteImageFromServer = async (imageId: string): Promise<void> => {
  try {
    await axios.delete(`/images/${imageId}`);
    console.log('Изображение удалено по ID:', imageId);
  } catch (error) {
    console.error('Ошибка при удалении изображения с сервера:', error);
    throw error;
  }
};

// Функция для обновления специфических данных в зависимости от типа объекта
const updateSpecificObjectData = async (
  realEstateObjectId: string,
  objectType: ObjectType,
  specificData: Record<string, any>,
): Promise<void> => {
  try {
    console.log('Обновляем специфические данные для типа:', objectType);

    // Получаем текущий объект недвижимости для получения ID специфических данных
    const objectResponse = await axios.get(`/objects/${realEstateObjectId}`);
    const objectData = objectResponse.data;
    let specificId: string | null = null;
    let endpoint = '';

    // Определяем ID специфических данных и эндпоинт в зависимости от типа объекта
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
      // Обновляем существующие специфические данные
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

      // Обновляем основной объект недвижимости с новым ID специфических данных
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

// Функция для обновления объекта недвижимости (улучшенная версия)
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

    // 1. Обновляем основной объект недвижимости
    console.log('Шаг 1: Обновление основного объекта');
    await axios.put(`/objects/${objectId}`, objectData);
    console.log('Шаг 1: Основной объект обновлен');

    // 2. Обновляем специфические данные в зависимости от типа
    console.log('Шаг 2: Обновление специфических данных');
    await updateSpecificObjectData(objectId, objectData.type, specificData);
    console.log('Шаг 2: Специфические данные обновлены');

    // 3. Управление изображениями
    console.log('Шаг 3: Управление изображениями');

    // 3.1 Получаем текущие изображения объекта
    let currentImages: any[] = [];
    try {
      const imagesResponse = await axios.get(
        `/images/by-object?objectId=${objectId}`,
      );
      if (imagesResponse.data && Array.isArray(imagesResponse.data)) {
        currentImages = imagesResponse.data;
      }
    } catch (error) {
      console.warn('Не удалось получить текущие изображения:', error);
    }

    // 3.2 Находим изображения для удаления (сопоставляем по очищенным URL)
    const existingCleanUrls = existingImages.map(url => cleanUrl(url));
    const imagesToDelete = currentImages.filter(
      img => !existingCleanUrls.includes(cleanUrl(img.url)),
    );

    // 3.3 Удаляем ненужные изображения
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

    // 3.4 Загружаем новые изображения
    if (newFiles.length > 0) {
      console.log('Загружаем новые изображения, количество:', newFiles.length);
      await uploadMultipleImages(newFiles, objectId, onUploadProgress);
      console.log('Новые изображения загружены');
    }

    // 3.5 Обновляем порядок изображений (ВАЖНО!)
    await updateImageOrder(objectId, existingImages);
    console.log('Порядок изображений обновлен');

    console.log('Обновление объекта завершено успешно');
  } catch (error: any) {
    console.error('Ошибка при обновлении объекта недвижимости:', error);
    console.error(
      'Детали ошибки:',
      error.response?.data || error.message || 'Неизвестная ошибка',
    );
    throw error;
  }
};
