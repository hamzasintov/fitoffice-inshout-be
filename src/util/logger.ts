import * as winston from 'winston';
import * as rTracer from 'cls-rtracer';

const service: string = 'api_backend';

const logFormat: winston.Logform.Format = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ timestamp, level, message }) => {
    const traceid = rTracer.id();
    return `[${timestamp}] [${level}] [${service}] [${traceid}] ${message}`;
  })
);

const logger: winston.Logger = winston.createLogger({
  level: 'info',
  format: logFormat,
  transports: [new winston.transports.Console()]
});

export default logger;
