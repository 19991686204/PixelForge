import express from 'express';

const router = express.Router();

// 认证相关路由

router.post('/register', (req, res) => {
  // 注册逻辑
  res.send('Register route');
});

router.post('/login', (req, res) => {
  // 登录逻辑
  res.send('Login route');
});

export default router;
