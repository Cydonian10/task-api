import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();
  // Log de la petición entrante
  logger.info(
    {
      //   method: req.method,
      //   url: req.url,
      //   userAgent: req.get("User-Agent"),
      //   ip: req.ip,
      //   contentType: req.get("Content-Type"),
      //   contentLength: req.get("Content-Length"),
    },
    `${req.method} ${req.url} - Request received`
  );

  //Interceptar el final de la respuesta
  // const originalSend = res.send;
  // res.send = function (body) {
  //   const duration = Date.now() - start;

  //   // Log de la respuesta
  //   logger.info(
  //     {
  //       // method: req.method,
  //       // url: req.url,
  //       // statusCode: res.statusCode,
  //       // duration: `${duration}ms`,
  //       // responseSize: body ? Buffer.byteLength(body) : 0,
  //     },
  //     `${req.method} ${req.url} - ${res.statusCode} ${duration}ms`
  //   );

  //   return originalSend.call(this, body);
  // };

  next();
};
