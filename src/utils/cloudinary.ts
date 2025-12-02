import config from '@/config';
import { v2 as cloudinary } from 'cloudinary';

import type { UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: config.NODE_ENV === 'production',
});

export default function uploadToCloudinary(
  buffer: Buffer<ArrayBufferLike>,
  publicId?: string,
): Promise<UploadApiResponse | undefined> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          public_id: publicId,
          folder: 'bog-api',
          transformation: { quality: 'auto' },
        },
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result || undefined);
        },
      )
      .end(buffer);
  });
}
