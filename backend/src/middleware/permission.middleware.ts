// 权限验证中间件
import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { errorResponse } from '../utils/response.util';
import Project from '../models/Project.model';

/**
 * 检查是否为项目所有者
 */
export const isProjectOwner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const projectId = req.params.id;
    
    // 检查用户是否已认证
    if (!req.user) {
      return errorResponse(res, 'Authentication required', 401);
    }
    
    const userId = req.user._id;

    const project = await Project.findById(projectId);

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    if (project.designer.toString() !== userId.toString()) {
      return errorResponse(res, 'You do not have permission to modify this project', 403);
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * 检查是否为管理员
 */
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // 检查用户是否已认证
  if (!req.user) {
    return errorResponse(res, 'Authentication required', 401);
  }
  
  if (req.user.role !== 'admin') {
    return errorResponse(res, 'Admin access required', 403);
  }
  next();
};
