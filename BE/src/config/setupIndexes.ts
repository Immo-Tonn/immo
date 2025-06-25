// Создайте новый файл: immo/BE/src/config/setupIndexes.ts

import mongoose from "mongoose";
import ImagesModel from "../models/ImagesModel";
import RealEstateObjectsModel from "../models/RealEstateObjectsModel";

export const setupDatabaseIndexes = async (): Promise<void> => {
  try {
    console.log("Creating database indexes...");

    // Индекс для коллекции images по полю realEstateObject
    await ImagesModel.collection.createIndex({ realEstateObject: 1 });
    console.log("✅ Index for images.realEstateObject created");

    // Индекс для коллекции realestateobjects по полю images
    await RealEstateObjectsModel.collection.createIndex({ images: 1 });
    console.log("✅ Index for realestateobjects.images created");

    // Дополнительные полезные индексы
    
    // Составной индекс для быстрого поиска изображений по объекту и типу
    await ImagesModel.collection.createIndex({ 
      realEstateObject: 1, 
      type: 1 
    });
    console.log("✅ Composite index for images.realEstateObject + type created");

    // Индекс для поиска объектов по статусу
    await RealEstateObjectsModel.collection.createIndex({ status: 1 });
    console.log("✅ Index for realestateobjects.status created");

    // Индекс для поиска объектов по типу
    await RealEstateObjectsModel.collection.createIndex({ type: 1 });
    console.log("✅ Index for realestateobjects.type created");

    // Индекс для поиска по цене
    await RealEstateObjectsModel.collection.createIndex({ price: 1 });
    console.log("✅ Index for realestateobjects.price createdн");

    // Индекс для поиска по дате добавления
    await RealEstateObjectsModel.collection.createIndex({ dateAdded: -1 });
    console.log("✅ Index for realestateobjects.dateAdded created");

    // Текстовый индекс для поиска по заголовку и описанию
    await RealEstateObjectsModel.collection.createIndex({
      title: "text",
      description: "text",
      location: "text"
    });
    console.log("✅ Text index for searching has been created");

    console.log("🎉 All indexes successfully created!");

  } catch (error) {
    console.error("❌ Error creating indexes:", error);
    throw error;
  }
};

// Функция для проверки существующих индексов
export const listExistingIndexes = async (): Promise<void> => {
  try {
    console.log("\n📋 Existing indexes:");
    
    const imagesIndexes = await ImagesModel.collection.listIndexes().toArray();
    console.log("Images collection:", imagesIndexes.map(idx => idx.name));
    
    const objectsIndexes = await RealEstateObjectsModel.collection.listIndexes().toArray();
    console.log("RealEstateObjects collection:", objectsIndexes.map(idx => idx.name));
    
  } catch (error) {
    console.error("Error getting index list:", error);
  }
};