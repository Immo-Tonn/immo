// immo/BE/src/config/db.ts
import mongoose from "mongoose";
import { setupDatabaseIndexes, listExistingIndexes } from "./setupIndexes";

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URI as string,
      {}
    );
    
    if (connection.connection.db) {
      console.log(`Database name: ${connection.connection.db.databaseName}`);
    }
    console.log("MongoDB connected.", connection.connection.host);

    // Create indices after connecting to the database
    try {
      // Show existing indices (optionally)
      await listExistingIndexes();
      
      // create the necessary indices
      await setupDatabaseIndexes();
    } catch (indexError) {
      console.warn("⚠️ Предупреждение: не удалось создать некоторые индексы:", indexError);
  // Do not interrupt the application due to errors with indexes
    }

  } catch (error) {
    console.error("❌ Ошибка подключения к MongoDB:", error);
    process.exit(1); // Interrupt when the connection error
  }
};

export default connectDb;

