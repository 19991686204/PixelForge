import express from 'express';
import { register, login, getCurrentUser, logout, forgotPassword, resetPassword } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// 认证相关路由

router.post('/register', async (req, res) => {
  try {
    await register(req, res);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '注册失败',
      errors: null,
      timestamp: new Date().toISOString()
    });
  }
});        // 用户注册

router.post('/login', async (req, res) => {
  try {
    await login(req, res);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '登录失败',
      errors: null,
      timestamp: new Date().toISOString()
    });
  }
});              // 用户登录

router.get('/me', authenticateToken, async (req, res) => {
  try {
    await getCurrentUser(req, res);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '获取用户信息失败',
      errors: null,
      timestamp: new Date().toISOString()
    });
  }
});  // 获取当前用户信息

router.post('/logout', authenticateToken, async (req, res) => {
  try {
    await logout(req, res);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '登出失败',
      errors: null,
      timestamp: new Date().toISOString()
    });
  }
});     // 用户登出

router.post('/forgot-password', async (req, res) => {
  try {
    await forgotPassword(req, res);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '发送重置链接失败',
      errors: null,
      timestamp: new Date().toISOString()
    });
  }
});     // 忘记密码

router.post('/reset-password', async (req, res) => {
  try {
    await resetPassword(req, res);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || '重置密码失败',
      errors: null,
      timestamp: new Date().toISOString()
    });
  }
});     // 重置密码

export default router;
