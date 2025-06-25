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

    // Создаем индексы после подключения к базе данных
    try {
      // Показываем существующие индексы (опционально)
      await listExistingIndexes();
      
      // Создаем необходимые индексы
      await setupDatabaseIndexes();
    } catch (indexError) {
      console.warn("⚠️ Предупреждение: не удалось создать некоторые индексы:", indexError);
      // Не прерываем работу приложения из-за ошибок с индексами
    }

  } catch (error) {
    console.error("❌ Ошибка подключения к MongoDB:", error);
    process.exit(1); // Прерываем работу при ошибке подключения
  }
};

export default connectDb;

// import mongoose from "mongoose";
// const connectDb = async () => {
//   try {
//     const connection = await mongoose.connect(
//       process.env.MONGO_URI as string,
//       {}
//     )

//     if (connection.connection.db) {
//       console.log(`Database name: ${connection.connection.db.databaseName}`);
//     }

//     console.log("MongoDB connected.", connection.connection.host);
//   } catch (error) {
//     console.error(error);
//     process.exit();
//   }
// };
// export default connectDb;
