import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import { logger } from "../utils/logger/logger.js";
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}${DB_NAME}`
    );
    logger.debug(
      `Mongodb Connected !! DB Host:${connectionInstance.connection.host}`
    );
  } catch (error) {
    logger.error("MongoDB connection error", {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

export default connectDB;
