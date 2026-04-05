import express from 'express';

const router = express.Router();

// 项目相关路由

router.get('/', (req, res) => {
  // 获取所有项目
  res.send('Get all projects');
});

router.post('/', (req, res) => {
  // 创建新项目
  res.send('Create project');
});

export default router;
