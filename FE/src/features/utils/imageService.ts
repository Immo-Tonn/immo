import axios from '@features/utils/axiosConfig';
import { ImageType } from './types';
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
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const uploadMultipleImages = async (
  files: File[],
  realEstateObjectId: string,
  onProgress?: (progress: number) => void,
): Promise<string[]> => {
  try {
    const imageUrls: string[] = [];
    let totalProgress = 0;

    if (files.length === 0) {
      return [];
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!file) {
        continue;
      }

      const isMain = i === 0;
      const type = isMain ? ImageType.MAIN : ImageType.ADDITIONAL;

      const url = await uploadImage(
        file,
        realEstateObjectId,
        type,
        progress => {
          const fileWeight = 1 / files.length;
          const currentFileProgress = progress * fileWeight;
          const baseProgress = (i / files.length) * 100;

          if (onProgress) {
            onProgress(baseProgress + currentFileProgress);
          }
        },
      );

      imageUrls.push(url);

      totalProgress = ((i + 1) / files.length) * 100;
      if (onProgress) {
        onProgress(totalProgress);
      }
    }

    return imageUrls;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};
