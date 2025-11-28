import winston from 'winston';

import config from '../config';

const { combine, timestamp, printf, colorize, json, errors, align } =
  winston.format;

const trasporters: winston.transport[] = [];

if (config.NODE_ENV !== 'production') {
  trasporters.push(
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }),
        align(),
        printf(({ timestamp, level, message, ...meta }) => {
          const metaString = Object.keys(meta).length
            ? JSON.stringify(meta)
            : '';

          return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaString}`;
        }),
      ),
    }),
  );
}

const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(timestamp(), errors({ stack: true }), json()),
  transports: trasporters,
  silent: config.NODE_ENV === 'test',
});

export { logger };
