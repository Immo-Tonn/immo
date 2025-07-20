// immo/BE/src/config/setupIndexes.ts
import mongoose from "mongoose";
import ImagesModel from "../models/ImagesModel";
import RealEstateObjectsModel from "../models/RealEstateObjectsModel";

export const setupDatabaseIndexes = async (): Promise<void> => {
  try {
    console.log("Creating database indexes...");

    // IMAGES index through the Realestateobject field
    await ImagesModel.collection.createIndex({ realEstateObject: 1 });
    console.log("✅ Index for images.realEstateObject created");

    // Realestateobjects index by Images field
    await RealEstateObjectsModel.collection.createIndex({ images: 1 });
    console.log("✅ Index for realestateobjects.images created");

    // Дополнительные полезные индексы
    
    // Composite index for quick search for images by object and type
    await ImagesModel.collection.createIndex({ 
      realEstateObject: 1, 
      type: 1 
    });
    console.log("✅ Composite index for images.realEstateObject + type created");

    // Index for the search for objects by status
    await RealEstateObjectsModel.collection.createIndex({ status: 1 });
    console.log("✅ Index for realestateobjects.status created");

    // Index for searching objects by type
    await RealEstateObjectsModel.collection.createIndex({ type: 1 });
    console.log("✅ Index for realestateobjects.type created");

    //Index for search  by price
    await RealEstateObjectsModel.collection.createIndex({ price: 1 });
    console.log("✅ Index for realestateobjects.price createdн");

    // Index for search by date of adding
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

// Function for checking existing indices
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