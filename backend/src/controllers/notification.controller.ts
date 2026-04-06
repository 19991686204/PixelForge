import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Notification from '../models/Notification.model';
import { successResponse, errorResponse } from '../utils/response.util';

/**
 * 获取当前用户的通知列表
 * GET /api/notifications
 */
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const notifications = await Notification.find({ recipient: req.user?._id })
      .populate('sender', 'username avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    // 获取未读数量
    const unreadCount = await Notification.countDocuments({
      recipient: req.user?._id,
      isRead: false,
    });

    successResponse(res, { notifications, unreadCount }, 'Notifications fetched');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to fetch notifications', 500);
  }
};

/**
 * 标记所有通知为已读
 * PUT /api/notifications/read-all
 */
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { recipient: req.user?._id, isRead: false },
      { isRead: true }
    );

    successResponse(res, null, 'All notifications marked as read');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to mark notifications', 500);
  }
};

/**
 * 删除单条通知
 * DELETE /api/notifications/:id
 */
export const deleteNotification = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    if (notification.recipient.toString() !== req.user?._id?.toString()) {
      return errorResponse(res, 'Not authorized', 403);
    }

    await notification.deleteOne();

    successResponse(res, null, 'Notification deleted');
  } catch (error: any) {
    errorResponse(res, error.message || 'Failed to delete notification', 500);
  }
};

/**
 * 工具函数：创建通知
 * 在其他控制器中调用
 */
export const createNotification = async (
  recipientId: string,
  senderId: string,
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system',
  content: string,
  link?: string
) => {
  try {
    // 不给自己发通知
    if (recipientId === senderId) return;

    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      content,
      link,
    });
  } catch (error) {
    console.error('Create notification error:', error);
  }
};
