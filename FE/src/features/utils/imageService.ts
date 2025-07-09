import axios from '@features/utils/axiosConfig';
import { ImageType } from './types';

// Функция для загрузки одного изображения
export const uploadImage = async (
  file: File,
  realEstateObjectId: string,
  type: ImageType = ImageType.ADDITIONAL,
  onProgress?: (progress: number) => void,
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('realEstateObject', realEstateObjectId);
    formData.append('type', type);

    const response = await axios.post('/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        // Проверяем, что progressEvent.total не undefined
        const total = progressEvent.total || 100;
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / total,
        );

        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });

    return response.data.url;
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    throw error;
  }
};

// Функция для загрузки нескольких изображений
export const uploadMultipleImages = async (
  files: File[],
  realEstateObjectId: string,
  onProgress?: (progress: number) => void,
): Promise<string[]> => {
  try {
    const imageUrls: string[] = [];
    let totalProgress = 0;

    // Проверяем наличие файлов перед обработкой
    if (files.length === 0) {
      return [];
    }

    console.log(`🔄 Начинаем загрузку ${files.length} изображений для объекта ${realEstateObjectId}`);

    // Сначала проверяем, есть ли уже изображения у объекта
    let hasExistingImages = false;
    try {
      const existingImagesResponse = await axios.get(`/images/by-object?objectId=${realEstateObjectId}`);
      hasExistingImages = existingImagesResponse.data && existingImagesResponse.data.length > 0;
      console.log(`📊 У объекта уже есть ${hasExistingImages ? existingImagesResponse.data.length : 0} изображений`);
    } catch (error) {
      console.log('ℹ️ У объекта пока нет изображений');
      hasExistingImages = false;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Проверка, что файл существует
      if (!file) {
        continue;
      }

      // Определяем тип изображения:
      // - Если у объекта нет изображений И это первый файл в загрузке - делаем его главным
      // - Иначе делаем дополнительным
      const isMain = !hasExistingImages && i === 0;
      const type = isMain ? ImageType.MAIN : ImageType.ADDITIONAL;

      console.log(`📤 Загружаем изображение ${i + 1}/${files.length}, тип: ${type}`);

      const url = await uploadImage(
        file,
        realEstateObjectId,
        type,
        progress => {
          // Рассчитываем прогресс для текущего файла как часть от общего прогресса
          const fileWeight = 1 / files.length;
          const currentFileProgress = progress * fileWeight;
          const baseProgress = (i / files.length) * 100;

          if (onProgress) {
            onProgress(baseProgress + currentFileProgress);
          }
        },
      );

      imageUrls.push(url);
      console.log(`✅ Изображение ${i + 1} загружено: ${url}`);

      // Обновляем общий прогресс после полной загрузки текущего файла
      totalProgress = ((i + 1) / files.length) * 100;
      if (onProgress) {
        onProgress(totalProgress);
      }
    }

    console.log(`✅ Все ${files.length} изображений успешно загружены`);
    return imageUrls;
  } catch (error) {
    console.error('❌ Ошибка при загрузке нескольких изображений:', error);
    throw error;
  }
};    