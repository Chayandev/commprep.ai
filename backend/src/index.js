import connectDB from "./db/index.js";
import { app } from "./app.js";
import { logger } from "./utils/logger/logger.js";

// // SSL certificate and key using environment variables
// const sslOptions = {
//   key: fs.readFileSync(process.env.SSL_KEY_PATH),
//   cert: fs.readFileSync(process.env.SSL_CERT_PATH),
// };

// Connect to MongoDB
connectDB()
  .then(() => {
    app.on("error", (error) => {
      logger.error("Express application error", {
        errorName: error.name,
        errorMessage: error.message,
        stack: error.stack,
      });
      throw error;
    });

    app.listen(process.env.PORT || 5000, () => {
      logger.info("Server started", {
        port: process.env.PORT || 5000,
      });
    });
  })
  .catch((error) => {
    logger.error("MongoDB connection failed", {
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    });
  });
