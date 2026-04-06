import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import { successResponse, errorResponse } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * 用户注册
 * POST /api/auth/register
 */
export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, username } = req.body;

    // 验证必填字段
    if (!email || !password || !username) {
      return errorResponse(res, '邮箱、密码和用户名不能为空', 400);
    }

    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, '邮箱已被注册', 400);
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return errorResponse(res, '用户名已被使用', 400);
    }

    // 创建新用户
    const user = new User({
      email,
      password,
      username,
      role: 'designer', // 默认角色
    });

    await user.save();

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'pixelforge-jwt-secret',
      { expiresIn: '7d' }
    );

    successResponse(res, {
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
    }, '注册成功');
  } catch (error: any) {
    errorResponse(res, error.message || '注册失败', 500);
  }
};

/**
 * 用户登录
 * POST /api/auth/login
 */
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // 验证必填字段
    if (!email || !password) {
      return errorResponse(res, '邮箱和密码不能为空', 400);
    }

    // 查找用户，包含密码字段
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, '用户不存在', 400);
    }

    // 验证密码
    if (!user.password) {
      return errorResponse(res, '用户没有设置密码', 400);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse(res, '密码错误', 400);
    }

    // 生成 JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'pixelforge-jwt-secret',
      { expiresIn: '7d' }
    );

    successResponse(res, {
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
      },
    }, '登录成功');
  } catch (error: any) {
    errorResponse(res, error.message || '登录失败', 500);
  }
};

/**
 * 获取当前用户信息
 * GET /api/auth/me
 */
export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return errorResponse(res, '用户未登录', 401);
    }

    successResponse(res, {
      user: {
        id: req.user._id,
        email: req.user.email,
        username: req.user.username,
        role: req.user.role,
        avatar: req.user.avatar,
        bio: req.user.bio,
        stats: req.user.stats,
      },
    }, '获取用户信息成功');
  } catch (error: any) {
    errorResponse(res, error.message || '获取用户信息失败', 500);
  }
};

/**
 * 用户登出
 * POST /api/auth/logout
 */
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // 对于 JWT，客户端需要删除 token
    // 对于 session，可以在这里清除 session
    successResponse(res, null, '登出成功');
  } catch (error: any) {
    errorResponse(res, error.message || '登出失败', 500);
  }
};