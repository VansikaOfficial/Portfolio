import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { env } from '@config/env';
import logger from '@config/logger';

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

if (env.STORAGE_DRIVER === 'cloudinary') {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

/**
 * Persists a locally-saved multer file to the configured storage driver
 * and returns the public-facing path/URL to store in the database.
 *
 * - "local": returns a relative path like /uploads/filename.jpg (file already on disk via multer).
 * - "cloudinary": uploads the local temp file to Cloudinary, deletes the local temp file,
 *   and returns the Cloudinary secure_url.
 */
export const persistUpload = async (
  localFilePath: string,
  folder: string
): Promise<string> => {
  if (env.STORAGE_DRIVER === 'cloudinary') {
    try {
      const result = await cloudinary.uploader.upload(localFilePath, {
        folder: `portfolio-cms/${folder}`,
      });
      fs.unlink(localFilePath, (err) => {
        if (err) logger.warn(`Failed to remove temp file ${localFilePath}: ${err.message}`);
      });
      return result.secure_url;
    } catch (err) {
      logger.error(`Cloudinary upload failed: ${(err as Error).message}`);
      throw err;
    }
  }

  // local driver: multer already saved the file under /uploads
  const fileName = path.basename(localFilePath);
  return `/uploads/${fileName}`;
};

/**
 * Deletes a previously stored file, given its stored path/URL.
 * Safe no-op if the file doesn't exist or is a Cloudinary URL and driver is local (or vice versa).
 */
export const deleteUpload = async (storedPath: string | null | undefined): Promise<void> => {
  if (!storedPath) return;

  if (storedPath.startsWith('http')) {
    // Cloudinary (or any remote) URL — attempt to derive public_id and destroy
    if (env.STORAGE_DRIVER === 'cloudinary') {
      try {
        const parts = storedPath.split('/');
        const fileWithExt = parts[parts.length - 1];
        const publicId = `portfolio-cms/${parts[parts.length - 2]}/${fileWithExt.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        logger.warn(`Failed to delete cloudinary asset: ${(err as Error).message}`);
      }
    }
    return;
  }

  const absolutePath = path.join(process.cwd(), storedPath.replace(/^\//, ''));
  fs.unlink(absolutePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      logger.warn(`Failed to delete local file ${absolutePath}: ${err.message}`);
    }
  });
};

export { UPLOADS_DIR };
