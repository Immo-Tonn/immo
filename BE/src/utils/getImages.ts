import ImagesModel from '../models/ImagesModel';

export const transformBunnyUrl = (url: string): string => {
  return url.replace(
    'https://storage.bunnycdn.com/immobilien-media',
    'https://immobilien-cdn.b-cdn.net',
  );
};

export const getAllImagesHelper = async () => {
  const images = await ImagesModel.find();
  if (!images || images.length === 0) return null;

  return images.map(img => ({
    ...img.toObject(),
    url: transformBunnyUrl(img.url),
  }));
};

export const getImageByIdHelper = async (id: string) => {
  const image = await ImagesModel.findById(id);
  if (!image) return null;

  return {
    ...image.toObject(),
    url: transformBunnyUrl(image.url),
  };
};

export const getImagesByObjectIdHelper = async (objectId: string) => {
  const images = await ImagesModel.find({
    realEstateObject: objectId,
  });
  if (!images || images.length === 0) return null;

  return images.map(img => ({
    ...img.toObject(),
    url: transformBunnyUrl(img.url),
  }));
};
