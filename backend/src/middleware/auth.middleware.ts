import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { IUser } from '../models/User.model';

// 扩展 Express Request 接口，添加用户信息
export interface AuthRequest extends Request {
  user?: any;
}

// JWT 认证中间件
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // 验证 JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    
    // 从数据库查找用户
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated' 
      });
    }

    // 将用户信息添加到请求对象
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    console.error('Auth middleware error:', error);
    // 对于非 JWT 错误，调用 next 传递错误
    next(error);
  }
};

// 可选认证中间件（不强制要求认证）
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // 忽略认证错误，继续执行
    next();
  }
};

// 验证用户角色
export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// 验证是否为资源所有者或管理员
export const requireOwnershipOrAdmin = (resourceOwnerField = 'designer') => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    // 管理员有所有权限
    if (req.user.role === 'admin') {
      return next();
    }

    // 检查是否为资源所有者
    const resourceId = req.params.id;
    if (!resourceId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Resource ID required' 
      });
    }

    try {
      // 这里需要根据具体的资源模型来检查所有权
      // 例如：Project、Comment 等
      // 这是一个通用实现，具体逻辑需要在路由中实现
      
      // 临时解决方案：在路由中手动检查所有权
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Ownership verification failed' 
      });
    }
  };
};