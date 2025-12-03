import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

import config from '@/config';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'blog-banners');

// Créer le dossier uploads si nécessaire
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export interface SavedImageData {
  filename: string;
  url: string;
  width: number;
  height: number;
  size: number;
}

export default async function saveImageLocally(
  buffer: Buffer,
  originalName?: string,
): Promise<SavedImageData> {
  await ensureUploadDir();

  // Générer un nom unique
  const ext = originalName ? path.extname(originalName) : '.jpg';
  const filename = `${randomUUID()}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  // Optimiser et sauvegarder l'image avec sharp
  const metadata = await sharp(buffer)
    .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(filepath);

  // Construire l'URL publique
  const baseUrl = config.BASE_URL || `http://localhost:${config.PORT}`;
  const url = `${baseUrl}/uploads/blog-banners/${filename}`;

  return {
    filename,
    url,
    width: metadata.width,
    height: metadata.height,
    size: metadata.size,
  };
}

// Fonction pour supprimer une image
export async function deleteImageLocally(filename: string): Promise<void> {
  try {
    const filepath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filepath);
  } catch (error) {
    console.error(`Failed to delete image: ${filename}`, error);
  }
}
