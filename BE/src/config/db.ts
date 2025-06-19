import mongoose from "mongoose";
const connectDb = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URI as string,
      {}
    )

    if (connection.connection.db) {
      console.log(`Database name: ${connection.connection.db.databaseName}`);
    }

    console.log("MongoDB connected.", connection.connection.host);
  } catch (error) {
    console.error(error);
    process.exit();
  }
};
export default connectDb;
