import { NextFunction, Request, Response } from "express";
import { CustomError } from "../common/entities/custom-error";
import logger from "../config/logger";

export const logsErrors = (
  error: any,
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  logger.error(
    {
      error: error.message,
      // stack: error.stack,
      // method: req.method,
      // url: req.url,
      // userAgent: req.get("User-Agent"),
      // ip: req.ip,
    },
    `Error capturado en ${req.method} ${req.url}`
  );
  next(error);
};

export const errorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.status(500).json({ message: `Internal server error ${error.message}` });
};

export const customHandlerError = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof CustomError) {
    logger.warn(
      {
        errorType: "CustomError",
        statusCode: error.statusCode,
        message: error.message,
        method: req.method,
        url: req.url,
      },
      `Custom error: ${error.message}`
    );

    return res.status(error.statusCode).json({
      status: error.statusCode,
      error: error.message,
    });
  } else {
    next(error);
  }
};
