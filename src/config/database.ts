import mongoose from 'mongoose';

import type { ConnectOptions } from 'mongoose';

import { logger } from '@/utils/winston';
import config from '../config';

const clientOptions: ConnectOptions = {
  dbName: 'blog-db',
  appName: 'Blog Api',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

export const connectToDatabase = async (): Promise<void> => {
  if (!config.MONGO_URI)
    throw new Error('MONGO_URI is not defined in environment variables');

  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    logger.info(
      'Connected to the database successfully',
      //   {
      //   uri: config.MONGO_URI,
      //   options: clientOptions,
      // }
    );
  } catch (error) {
    if (error instanceof Error) throw error;

    logger.error('Error connecting to MongoDB:', error);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('Disconnected from the database successfully');
  } catch (error) {
    if (error instanceof Error) throw error;
    logger.error('Error disconnecting from MongoDB:', error);
  }
};
