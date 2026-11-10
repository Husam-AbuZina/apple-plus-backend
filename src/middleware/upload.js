import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import AppError from '../utils/AppError.js';

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, callback) => callback(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 },
  fileFilter: (req, file, callback) => callback(allowedTypes.has(file.mimetype) ? null : new AppError('Only JPEG, PNG, and WebP images are allowed', 400), allowedTypes.has(file.mimetype))
});

export const uploadProductImages = upload.array('images', 6);
