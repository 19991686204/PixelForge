import express from 'express';
import { upload } from '../utils/upload.util';
import {
  getUserProfile,
  updateProfile,
  toggleFollow,
  getFollowing,
  getFollowers,
  getTopDesigners,
} from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// 公开路由
router.get('/top-designers', getTopDesigners);         // 热门设计师
router.get('/:username', getUserProfile);              // 用户资料
router.get('/:userId/following', getFollowing);        // 关注列表
router.get('/:userId/followers', getFollowers);        // 粉丝列表

// 需要登录的路由
router.put(
  '/profile',
 authenticateToken,
  upload.single('avatar'),       // 单张头像上传
  updateProfile
);

router.post('/:userId/follow', authenticateToken, toggleFollow);

export default router;
