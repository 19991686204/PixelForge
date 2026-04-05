import express from 'express';

const router = express.Router();

// 用户相关路由

router.get('/profile', (req, res) => {
  // 获取用户个人资料
  res.send('Get user profile');
});

router.put('/profile', (req, res) => {
  // 更新用户个人资料
  res.send('Update user profile');
});

export default router;
