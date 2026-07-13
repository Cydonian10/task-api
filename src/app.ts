import "reflect-metadata";
import { ServerApp } from "./server";
import { AppRoutes } from "./routes";
import { AppDataSource } from "./database/data-source";
import { setupDashboard } from "./dashboard";
import dotenv from "dotenv";
import logger from "./config/logger";

dotenv.config();

(async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connection established");
  } catch (error) {
    logger.error({ error }, "Failed to initialize database connection");
    process.exit(1);
  }

  const server = new ServerApp({
    port: 3000,
    publicPath: "public",
  });

  server.setRoutes(AppRoutes.routes());

  setupDashboard(server.httpServer);

  server.start();
})();
