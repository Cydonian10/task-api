import pino from "pino";

// Configuración del logger Pino
const isDevelopment = process.env.NODE_ENV !== "production";
const logLevel = process.env.LOG_LEVEL || "info";

const logger = pino({
  level: logLevel,
  transport: isDevelopment
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:yyyy-mm-dd HH:MM:ss",
          ignore: "pid,hostname",
          messageFormat: "{time} [{level}] {msg}",
          errorLikeObjectKeys: ["err", "error"],
        },
      }
    : undefined,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
    log: (object) => {
      // En producción, filtrar información sensible
      if (!isDevelopment) {
        const { password, token, authorization, ...cleanObject } =
          object as any;
        return cleanObject;
      }
      return object;
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    error: pino.stdSerializers.err,
  },
});

export default logger;
