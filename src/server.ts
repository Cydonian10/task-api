import express, { Router } from "express";
import http from "node:http";
import {
  customHandlerError,
  errorHandler,
  logsErrors,
} from "./middlewares/error.middlware";
import { requestLogger } from "./middlewares/request-logger.middleware";
import logger from "./config/logger";
import cors from "cors";

interface Options {
  port: number;
  publicPath: string;
}

export class ServerApp {
  public readonly app = express();
  public readonly httpServer: http.Server;
  private port: number;
  private publicPath: string;

  constructor(options: Options) {
    this.port = options.port;
    this.publicPath = options.publicPath;
    this.httpServer = http.createServer(this.app);

    this.configure();
  }

  private configure() {
    this.app.use(requestLogger);

    this.app.use(express.static(this.publicPath));
    this.app.use(express.json());
    this.app.use(cors());
  }

  public setRoutes(router: Router) {
    this.app.use(router);
    this.app.use(logsErrors);
    this.app.use(customHandlerError);
    this.app.use(errorHandler);
  }

  public start() {
    this.httpServer.listen(this.port, () => {
      logger.info(
        {
          port: this.port,
          environment: process.env.NODE_ENV || "development",
          logger: process.env.LOG_LEVEL || "info",
        },
        `🚀 Server started successfully on http://localhost:${this.port}`,
      );
    });
  }

  public close() {
    this.httpServer.close();
  }
}
