import "dotenv/config";
import http from "http";
import app from "./app";
import mongoose from "mongoose";
import { connectDB } from "./config/db";
import { logger } from "./config/logger";

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

mongoose.connection.once("open", () => {
  logger.info("MongoDB connection ready");
});

mongoose.connection.on("error", (err: any) => {
  logger.error("MongoDB connection error", err);
});

async function startServer() {
  connectDB();

  server.listen(PORT, () => {
    logger.info(`AI-Insights is running on port ${PORT}`);
  });
}

startServer();
