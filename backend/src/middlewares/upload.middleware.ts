import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { env } from '@config/env';
import { UPLOADS_DIR } from '@utils/storage';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const ALLOWED_DOC_TYPES = ['application/pdf'];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const imageFileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, png, webp, gif, svg) are allowed'));
  }
};

const documentFileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  if (ALLOWED_DOC_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'));
  }
};

const maxSize = env.MAX_UPLOAD_MB * 1024 * 1024;

export const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: maxSize },
});

export const uploadDocument = multer({
  storage,
  fileFilter: documentFileFilter,
  limits: { fileSize: maxSize },
});
