import { Request, Response, NextFunction } from 'express';

/**
 * 请求日志中间件
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // 响应完成后记录日志
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 400) {
      console.error(`❌ ${log}`);
    } else {
      console.log(`✅ ${log}`);
    }
  });

  next();
};
