import saveImageLocally from '@/utils/saveImageLocally';
import { logger } from '@/utils/winston';
import type { Request, Response, NextFunction } from 'express';

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export default function uploadBlogBanner(method: 'post' | 'put') {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (method === 'put' && !req.file) {
      next();
      return;
    }

    if (!req.file) {
      res.status(400).json({
        code: 'ValidationError',
        message: 'Blog banner is required',
      });
      return;
    }

    if (req.file.size > MAX_FILE_SIZE) {
      res.status(413).json({
        code: 'ValidationError',
        message: 'File size must be less than 2MB',
      });
      return;
    }

    try {
      const data = await saveImageLocally(
        req.file.buffer,
        req.file.originalname,
      );

      if (!data) {
        res.status(500).json({
          code: 'UploadError',
          message: 'Failed to save image',
        });
        return;
      }

      const newBanner = {
        publicId: data.filename,
        url: data.url,
        width: data.width,
        height: data.height,
      };

      logger.info(`Blog banner saved locally: ${newBanner.publicId}`);

      req.body.banner = newBanner;
      next();
    } catch (error: any) {
      res.status(500).json({
        code: 'UploadError',
        message: error?.message || 'An error occurred during image upload',
      });

      logger.error(`Error saving blog banner: ${error.message}`);
    }
  };
}
