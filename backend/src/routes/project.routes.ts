import express from 'express';
import { upload } from '../utils/upload.util';
import {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  toggleLike,
  toggleSave,
  getTrendingProjects,
  getLikedProjects,
  getSavedProjects,
} from '../controllers/project.controller';
import { authenticateToken, requireRole } from '../middleware/auth.middleware';
import { isProjectOwner } from '../middleware/permission.middleware';

const router = express.Router();

// 公开路由（不需要登录）
router.get('/', getAllProjects);                    // 获取所有项目
router.get('/trending', getTrendingProjects);       // 获取热门项目
router.get('/:id', getProjectById);                // 获取项目详情

// 需要登录的路由
router.post(
  '/',
  authenticateToken,
  requireRole(['designer']),
  upload.array('files', 25),   // 最多25个文件（20张图片+5个视频）
  createProject
);

router.put(
  '/:id',
  authenticateToken,
  isProjectOwner,               // 检查是否为项目所有者
  updateProject
);

router.delete(
  '/:id',
  authenticateToken,
  isProjectOwner,
  deleteProject
);

router.post('/:id/like', authenticateToken, toggleLike);
router.post('/:id/save', authenticateToken, toggleSave);

// 获取用户点赞和收藏的项目
router.get('/liked', authenticateToken, getLikedProjects);
router.get('/saved', authenticateToken, getSavedProjects);

export default router;
