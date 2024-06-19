import winston from "winston";
import * as dotenv from "dotenv";

dotenv.config();

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "yellow",
    warning: "blue",
    info: "green",
    http: "magenta",
    debug: "white",
  },
};

winston.addColors(customLevels.colors);

const devLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "debug",
      format: winston.format.simple(),
    }),
  ],
});

const prodLogger = winston.createLogger({
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "./errors.log",
      level: "info",
      format: winston.format.simple(),
    }),
  ],
});

const myLogger =
  process.env.NODE_ENV === "development" ? devLogger : prodLogger;

export const addLogger = (req, _res, next) => {
  req.logger = myLogger;
  req.logger.http(
    `${req.method} in ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};

export const startLogger = (message) => {
  myLogger.info(message);
};