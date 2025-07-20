import ImagesModel from '../models/ImagesModel';

export const transformBunnyUrl = (url: string): string => {
  return url.replace(
    'https://storage.bunnycdn.com/immobilien-media',
    'https://immobilien-cdn.b-cdn.net',
  );
};

export const getAllImagesHelper = async () => {
  try {
    const images = await ImagesModel.find();
    
    if (!images || images.length === 0) {
      console.log('ℹ️ There are no images in the database');
      return [];
    }

    return images.map(img => ({
      ...img.toObject(),
      url: transformBunnyUrl(img.url),
    }));
  } catch (error) {
    console.error('❌ Error in getAllImagesHelper:', error);
    return [];
  }
};

export const getImageByIdHelper = async (id: string) => {
  const image = await ImagesModel.findById(id);
  if (!image) return null;

  return {
    ...image.toObject(),
    url: transformBunnyUrl(image.url),
  };
};
