// immo/FE/src/features/utils/realEstateService.ts
import axios from '@features/utils/axiosConfig';
import { IRealEstateObject, ObjectType } from './types';
import { uploadMultipleImages } from './imageService';

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

//Function to update the order of images
export const updateImageOrder = async (
  objectId: string,
  orderedImageUrls: string[],
): Promise<void> => {
  try {
    console.log('Bildreihenfolge für Immobilie aktualisieren:', objectId);
    console.log('Neue URL-Reihenfolge:', orderedImageUrls);

    // Get all images of an object
    const imagesResponse = await axios.get(
      `/images/by-object?objectId=${objectId}`,
    );
    if (!imagesResponse.data || !Array.isArray(imagesResponse.data)) {
      console.warn('Keine Bilder gefunden');
      return;
    }
    const allImages = imagesResponse.data;
    console.log('Alle Bilder gefunden:', allImages);

    // Create an array of image IDs in the correct order
    const orderedImageIds: string[] = [];

    // First add existing images in the correct order
    orderedImageUrls.forEach(url => {
      const cleanedUrl = cleanUrl(url);
      const imageObj = allImages.find(img => cleanUrl(img.url) === cleanedUrl);
      if (imageObj) {
        orderedImageIds.push(imageObj._id || imageObj.id);
      }
    });

    // Then add new images (that are not in orderedImageUrls)
    allImages.forEach(img => {
      const imageId = img._id || img.id;
      if (!orderedImageIds.includes(imageId)) {
        orderedImageIds.push(imageId);
      }
    });

    console.log('Endgültige Bild-ID-Reihenfolge:', orderedImageIds);

    //Update the type of the first image to "main"
    if (orderedImageIds.length > 0) {
      const mainImageId = orderedImageIds[0];

      // First reset all images to "additional"
      for (const img of allImages) {
        if (img.type === 'main') {
          try {
            await axios.put(`/images/${img._id || img.id}`, {
              type: 'additional',
            });
          } catch (error) {
            console.warn('Fehler beim Zurücksetzen des Bildtyps:', error);
          }
        }
      }

      // Set the first image as the main
      try {
        await axios.put(`/images/${mainImageId}`, {
          type: 'main',
        });
        console.log('Главное изображение установлено:', mainImageId);
      } catch (error) {
        console.warn('Ошибка при установке главного изображения:', error);
      }
    }

    // Update the main property object with the new order of images
    await axios.put(`/objects/${objectId}`, {
      images: orderedImageIds,
    });

    console.log('Порядок изображений успешно обновлен');
  } catch (error) {
    console.error('Ошибка при обновлении порядка изображений:', error);
    throw error;
  }
};

// Create specific data depending on the property type
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

// Function to update a property
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

    // 1. Updating the main property object
    console.log('Шаг 1: Обновление основного объекта');
    await axios.put(`/objects/${objectId}`, objectData);
    console.log('Шаг 1: Основной объект обновлен');

    // 2.Updating specific data depending on the type
    console.log('Шаг 2: Обновление специфических данных');
    await updateSpecificObjectData(objectId, objectData.type, specificData);
    console.log('Шаг 2: Специфические данные обновлены');

    // 3. Managing images
    console.log('Шаг 3: Управление изображениями');

    // 3.1 Getting current images of the property
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

    // 3.2 Finding images to delete (matching by cleaned URLs)
    const existingCleanUrls = existingImages.map(url => cleanUrl(url));
    const imagesToDelete = currentImages.filter(
      img => !existingCleanUrls.includes(cleanUrl(img.url)),
    );

    // 3.3 Removing unnecessary images
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

    // 3.4 Uploading new images
    if (newFiles.length > 0) {
      console.log('Загружаем новые изображения, количество:', newFiles.length);
      await uploadMultipleImages(newFiles, objectId, onUploadProgress);
      console.log('Новые изображения загружены');
    }

    // 3.5 Updating the order of images (IMPORTANT!)
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
