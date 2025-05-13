import { url } from "inspector";
import ImagesModel from "../models/ImagesModel";

// Заменяет storage-ссылку на CDN-ссылку
export const transformBunnyUrl = (url: string): string => {
  return url.replace(
    "https://storage.bunnycdn.com/immobilien-media",
    "https://immobilien-cdn.b-cdn.net"
  );
};

// Получить все изображения с корректными URL
export const getAllImagesHelper = async () => {
  const images = await ImagesModel.find();
  if (!images || images.length === 0) return null;

  return images.map((img) => ({
    ...img.toObject(),
    url: transformBunnyUrl(img.url),
  }));
};

// Получить одно изображение по ID с заменой URL
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

  return images.map((img) => ({
    ...img.toObject(),
    url: transformBunnyUrl(img.url),
  }));
};
