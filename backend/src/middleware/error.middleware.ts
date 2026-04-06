import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.util';

/**
 * 全局错误处理中间件
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('❌ Error:', err);

  // Mongoose 验证错误
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return errorResponse(res, 'Validation Error', 400, errors);
  }

  // Mongoose 重复键错误
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return errorResponse(res, `${field} already exists`, 400);
  }

  // JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Multer 文件上传错误
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return errorResponse(res, 'File too large (max 10MB)', 400);
    }
    return errorResponse(res, err.message, 400);
  }

  // 默认服务器错误
  return errorResponse(
    res,
    err.message || 'Internal Server Error',
    err.statusCode || 500
  );
};

/**
 * 404 Not Found 中间件
 */
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  errorResponse(res, `Route ${req.originalUrl} not found`, 404);
};
