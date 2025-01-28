import winston from 'winston'
import { envs } from './parser'

/*
* Initialize the logger with the log level from environment or default to 'info'
* */
export const logger = winston.createLogger({
  level: envs.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});
