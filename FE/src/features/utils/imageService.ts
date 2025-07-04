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

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Проверка, что файл существует
      if (!file) {
        continue;
      }
      const isMain = i === 0; // Первое изображение будет главным
      const type = isMain ? ImageType.MAIN : ImageType.ADDITIONAL;

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

      // Обновляем общий прогресс после полной загрузки текущего файла
      totalProgress = ((i + 1) / files.length) * 100;
      if (onProgress) {
        onProgress(totalProgress);
      }
    }

    return imageUrls;
  } catch (error) {
    console.error('Ошибка при загрузке нескольких изображений:', error);
    throw error;
  }
};
