import axios from '@features/utils/axiosConfig';
import { IRealEstateObject, ObjectType } from './types';
import { uploadMultipleImages } from './imageService';

export const createRealEstateObject = async (
  objectData: IRealEstateObject,
): Promise<string> => {
  try {
    const response = await axios.post('/objects', objectData);
    return response.data._id;
  } catch (error) {
    console.error('Error creating property object:', error);
    throw error;
  }
};

const cleanUrl = (url: string): string => {
  const parts = url.split('?t=');
  return parts[0] || url;
};

export const updateImageOrder = async (
  objectId: string,
  orderedImageUrls: string[],
): Promise<void> => {
  try {
    const imagesResponse = await axios.get(
      `/images/by-object?objectId=${objectId}`,
    );
    if (!imagesResponse.data || !Array.isArray(imagesResponse.data)) {
      console.warn('Images not found');
      return;
    }
    const allImages = imagesResponse.data;
    console.log('All found images:', allImages);

    const orderedImageIds: string[] = [];

    orderedImageUrls.forEach(url => {
      const cleanedUrl = cleanUrl(url);
      const imageObj = allImages.find(img => cleanUrl(img.url) === cleanedUrl);
      if (imageObj) {
        orderedImageIds.push(imageObj._id || imageObj.id);
      }
    });

    allImages.forEach(img => {
      const imageId = img._id || img.id;
      if (!orderedImageIds.includes(imageId)) {
        orderedImageIds.push(imageId);
      }
    });

    if (orderedImageIds.length > 0) {
      const mainImageId = orderedImageIds[0];

      for (const img of allImages) {
        if (img.type === 'main') {
          try {
            await axios.put(`/images/${img._id || img.id}`, {
              type: 'additional',
            });
          } catch (error) {
            console.warn('Error resetting image type:', error);
          }
        }
      }
      try {
        await axios.put(`/images/${mainImageId}`, {
          type: 'main',
        });
      } catch (error) {}
    }
    await axios.put(`/objects/${objectId}`, {
      images: orderedImageIds,
    });
  } catch (error) {
    throw error;
  }
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
        throw new Error('Unknow type of Object');
    }

    await axios.post(endpoint, data);
  } catch (error) {
    throw error;
  }
};

export const createCompleteRealEstateObject = async (
  objectData: IRealEstateObject,
  specificData: Record<string, any>,
  files: File[],
  onUploadProgress?: (progress: number) => void,
): Promise<string> => {
  try {
    const realEstateObjectId = await createRealEstateObject(objectData);

    await createSpecificObjectData(
      realEstateObjectId,
      objectData.type,
      specificData,
    );
    if (files.length > 0) {
      await uploadMultipleImages(files, realEstateObjectId, onUploadProgress);
    }

    return realEstateObjectId;
  } catch (error: any) {
    error.response?.data || error.message || 'Unknown error',
      console.error('Code error:', error.code);
    console.error('Status:', error.response?.status);
    throw error;
  }
};

export const fetchObjectForEdit = async (
  objectId: string,
): Promise<{
  objectData: any;
  specificData: any;
  images: string[];
  videos: any[];
}> => {
  try {
    const objectResponse = await axios.get(`/objects/${objectId}`);
    const objectData = objectResponse.data;

    let images: string[] = [];
    try {
      const imagesResponse = await axios.get(
        `/images/by-object?objectId=${objectId}`,
      );
      if (imagesResponse.data && Array.isArray(imagesResponse.data)) {
        images = imagesResponse.data.map((img: any) => img.url);
      }
      console.log('Images are uploaded:', images);
    } catch (imageError) {
      console.warn('Error per upload images:', imageError);
    }

    let videos: any[] = [];
    try {
      const videosResponse = await axios.get(
        `/videos/by-object?objectId=${objectId}`,
      );
      if (videosResponse.data && Array.isArray(videosResponse.data)) {
        videos = videosResponse.data;
      }
    } catch (videoError) {
      console.warn('Error per uploading videos:', videoError);
    }

    let specificData = null;
    try {
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
    } catch (specificError) {
      console.warn('Error per uploading specific datas:', specificError);
    }

    return {
      objectData,
      specificData,
      images,
      videos,
    };
  } catch (error) {
    console.error('Error per edditing :', error);
    throw error;
  }
};

export const deleteImageFromServer = async (imageId: string): Promise<void> => {
  try {
    await axios.delete(`/images/${imageId}`);
    console.log('Изображение удалено по ID:', imageId);
  } catch (error) {
    console.error('Ошибка при удалении изображения с сервера:', error);
    throw error;
  }
};

const updateSpecificObjectData = async (
  realEstateObjectId: string,
  objectType: ObjectType,
  specificData: Record<string, any>,
): Promise<void> => {
  try {
    const objectResponse = await axios.get(`/objects/${realEstateObjectId}`);
    const objectData = objectResponse.data;
    let specificId: string | null = null;
    let endpoint = '';

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
        throw new Error('Undef type of Object');
    }
    if (specificId) {
      await axios.put(`${endpoint}/${specificId}`, specificData);
    } else {
      const data = {
        ...specificData,
        realEstateObject: realEstateObjectId,
      };
      const response = await axios.post(endpoint, data);

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
    throw error;
  }
};

export const updateCompleteRealEstateObject = async (
  objectId: string,
  objectData: any,
  specificData: Record<string, any>,
  newFiles: File[],
  existingImages: string[],
  onUploadProgress?: (progress: number) => void,
): Promise<void> => {
  try {
    await axios.put(`/objects/${objectId}`, objectData);
    await updateSpecificObjectData(objectId, objectData.type, specificData);

    let currentImages: any[] = [];
    try {
      const imagesResponse = await axios.get(
        `/images/by-object?objectId=${objectId}`,
      );
      if (imagesResponse.data && Array.isArray(imagesResponse.data)) {
        currentImages = imagesResponse.data;
      }
    } catch (error) {
      console.warn('Error per receiving datas:', error);
    }

    const existingCleanUrls = existingImages.map(url => cleanUrl(url));
    const imagesToDelete = currentImages.filter(
      img => !existingCleanUrls.includes(cleanUrl(img.url)),
    );

    for (const imageToDelete of imagesToDelete) {
      try {
        await deleteImageFromServer(imageToDelete._id);
      } catch (error) {
        console.warn('Error per deleting image:', imageToDelete._id, error);
      }
    }

    if (newFiles.length > 0) {
      await uploadMultipleImages(newFiles, objectId, onUploadProgress);
    }
    await updateImageOrder(objectId, existingImages);
  } catch (error: any) {
    console.error(
      'Error details:',
      error.response?.data || error.message || 'Unknown error',
    );
    throw error;
  }
};
