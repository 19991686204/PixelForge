import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import path from 'path';
import { Request } from 'express';

// 配置 Cloudinary
cloudinary.v2.config({
  cloud_name: 'daanuflx3',
  api_key: '268883327455487',
  api_secret: 'JDBhrtvTsLCCsjy_U1Q2JZM2TAs',
});

// 调试日志
console.log('Cloudinary configured:', true, true);

// 配置 Cloudinary 存储
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2 as any,
  params: {
    folder: 'pixelforge',
    format: (_: any, file: Express.Multer.File) => file.originalname.split('.').pop() || 'jpg',
    public_id: () => `${Date.now()}-${Math.round(Math.random() * 1e9)}`,
    resource_type: (_: any, file: Express.Multer.File) => {
      const isVideo = file.mimetype.startsWith('video/');
      return isVideo ? 'video' : 'image';
    },
  } as any,
});

// 文件过滤器
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // 允许的图片格式
  const allowedImageTypes = /jpeg|jpg|png|gif|webp/;
  const allowedVideoTypes = /mp4|mov|avi|mkv|webm/;
  
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;
  
  // 更宽松的检查：只要扩展名或 MIME 类型匹配即可
  const isImage = allowedImageTypes.test(extname) || mimetype.startsWith('image/');
  const isVideo = allowedVideoTypes.test(extname) || mimetype.startsWith('video/');
  
  // 调试日志
  console.log('File filter:', file.originalname, 'ext:', extname, 'mimetype:', mimetype, 'isImage:', isImage, 'isVideo:', isVideo);
  
  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPEG, JPG, PNG, GIF, WEBP) and videos (MP4, MOV, AVI, MKV, WEBM) are allowed'));
  }
};

// 导出 multer 配置
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 限制（Cloudinary 免费版限制）
  },
});
