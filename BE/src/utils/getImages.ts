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

    // ИСПРАВЛЕНО: Возвращаем пустой массив вместо null
    if (!images || images.length === 0) {
      console.log('ℹ️ В базе данных нет изображений');
      return []; // Возвращаем пустой массив вместо null
    }

    return images.map(img => ({
      ...img.toObject(),
      url: transformBunnyUrl(img.url),
    }));
  } catch (error) {
    console.error('❌ Ошибка в getAllImagesHelper:', error);
    return []; // При ошибке тоже возвращаем пустой массив
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
