import { Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.model';
import { successResponse, errorResponse } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true, // 使用 SSL
  auth: {
    user: '2265278438@qq.com', // 直接使用邮箱地址
    pass: 'dwomaaansjxodjfa', // 直接使用授权码
  },
});

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

/**
 * 忘记密码
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body;

    // 验证必填字段
    if (!email) {
      return errorResponse(res, '邮箱不能为空', 400);
    }

    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      // 为了安全，即使邮箱不存在，也返回成功响应
      return successResponse(res, null, '密码重置链接已发送到您的邮箱');
    }

    // 生成密码重置令牌
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'pixelforge-jwt-secret',
      { expiresIn: '1h' } // 1小时有效期
    );

    // 构建重置密码链接，使用路径参数格式
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // 发送邮件
    try {
      await transporter.sendMail({
        from: '2265278438@qq.com',
        to: email,
        subject: '密码重置请求',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>密码重置</h2>
            <p>您好，</p>
            <p>我们收到了您的密码重置请求。请按照以下步骤重置您的密码：</p>
            <p style="margin: 20px 0;">
              <strong>步骤 1：</strong> 复制以下重置链接到浏览器地址栏：<br>
              <code style="background: #f4f4f4; padding: 10px; border-radius: 4px; font-family: monospace; display: block; word-break: break-all;">http://localhost:3000/reset-password/${resetToken}</code>
            </p>
            <p style="margin: 20px 0;">
              <strong>步骤 2：</strong> 在页面中输入新密码（至少8个字符）
            </p>
            <p style="margin: 20px 0;">
              <strong>步骤 3：</strong> 点击 "Reset Password" 按钮
            </p>
            <p>如果您没有请求重置密码，请忽略此邮件。</p>
            <p>此链接将在 1 小时后过期。</p>
            <p>谢谢，</p>
            <p>PixelForge 团队</p>
          </div>
        `,
      });
      
      console.log(`密码重置链接已发送到 ${email}`);
      successResponse(res, null, '密码重置链接已发送到您的邮箱');
    } catch (emailError: any) {
      console.error('发送邮件失败:', emailError.message);
      console.error('错误详情:', emailError);
      errorResponse(res, `发送邮件失败: ${emailError.message || '未知错误'}`, 500);
    }
  } catch (error: any) {
    errorResponse(res, error.message || '发送重置链接失败', 500);
  }
};

/**
 * 重置密码
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { token, password } = req.body;

    // 验证必填字段
    if (!token || !password) {
      return errorResponse(res, '令牌和密码不能为空', 400);
    }

    // 验证令牌
    let decoded: any;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'pixelforge-jwt-secret');
    } catch (error) {
      return errorResponse(res, '无效或过期的令牌', 400);
    }

    // 查找用户
    const user = await User.findById(decoded.userId);
    if (!user) {
      return errorResponse(res, '用户不存在', 400);
    }

    // 更新密码（触发密码哈希）
    user.password = password;
    await user.save();

    successResponse(res, null, '密码重置成功');
  } catch (error: any) {
    errorResponse(res, error.message || '重置密码失败', 500);
  }
};