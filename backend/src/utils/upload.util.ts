import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import path from 'path';
import { Request } from 'express';

// 配置 Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 配置 Cloudinary 存储
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2 as any,
  params: {
    folder: 'pixelforge',
    format: (_: any, file: Express.Multer.File) => file.originalname.split('.').pop() || 'jpg',
    public_id: () => `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
  } as any,
});

// 文件过滤器
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // 允许的图片格式
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// 导出 multer 配置
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 限制
  },
});
