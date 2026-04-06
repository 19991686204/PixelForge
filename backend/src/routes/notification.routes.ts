import express from 'express';
import {
  getNotifications,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

// 全部需要登录
router.use(authenticateToken);

router.get('/', getNotifications);                     // 获取通知列表
router.put('/read-all', markAllAsRead);                // 全部标记已读
router.delete('/:id', deleteNotification);             // 删除通知

export default router;
