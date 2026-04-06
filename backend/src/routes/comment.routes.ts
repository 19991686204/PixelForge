import express from 'express';
import {
  createComment,
  getProjectComments,
  deleteComment,
} from '../controllers/comment.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// 公开路由
router.get('/project/:projectId', getProjectComments);  // 获取项目评论

// 需要登录的路由
router.post('/', authenticateToken, createComment);         // 创建评论
router.delete('/:id', authenticateToken, deleteComment);   // 删除评论

export default router;
