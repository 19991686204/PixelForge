import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';

// 异步路由处理函数包装器
export const asyncHandler = (fn: (req: AuthRequest, res: Response) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req as AuthRequest, res).catch((error) => {
      console.error('Error in async handler:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error',
        errors: null,
        timestamp: new Date().toISOString()
      });
    });
  };
};

// 异步中间件包装器
export const asyncMiddleware = (fn: (req: AuthRequest, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req as AuthRequest, res, next);
    } catch (error) {
      next(error);
    }
  };
};