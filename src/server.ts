import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import type { CorsOptions } from 'cors';

import config from './config';
import limiter from './lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from './lib/mongoose';
import v1Router from './routes/v1';
import { logger } from './lib/winston';

const app = express();

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (config.NODE_ENV === 'development' || !origin) {
      callback(null, true);
    } else {
      callback(
        new Error(`CORS Error: ${origin} is not allowed by CORS`),
        false,
      );
    }
  },
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(
  compression({
    threshold: 1024,
  }),
);
app.use(helmet());
app.use(limiter);

(async () => {
  try {
    await connectToDatabase();

    app.use('/api/v1', v1Router);

    app.listen(config.PORT, () => {
      logger.info(`Server is running on http://localhost:${config.PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start the server', error);

    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
})();

const handleServerShutdown = async () => {
  try {
    await disconnectFromDatabase();
    logger.info('Server SHUTDOWN');
    process.exit(0);
  } catch (error) {
    logger.error('Error during server shutdown', error);
  }
};

process.on('SIGINT', handleServerShutdown);
process.on('SIGTERM', handleServerShutdown);
