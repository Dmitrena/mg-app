import mongoose from "mongoose";
import app from "./app.js";
import config from "./config/config.js";
import { loggerFactory } from "mg-shared";

const logger = loggerFactory(import.meta.url);

const PORT = config.app.port;

mongoose
  .connect(config.mongodb.uri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      logger.info({
        step: "🚀 Server ready",
        endpoint: `http://localhost:${PORT}`,
      });
    });
  })
  .catch((error) => {
    logger.error({ step: "MongoDB connection error", error });
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });
