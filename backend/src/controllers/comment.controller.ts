import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Comment from '../models/Comment.model';
import Project from '../models/Project.model';
import { successResponse, errorResponse } from '../utils/response.util';

/**
 * 创建评论
 * POST /api/comments
 */
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content, projectId, parentId } = req.body;

    // 验证项目是否存在
    const project = await Project.findById(projectId);
    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    if (!project.allowComments) {
      return errorResponse(res, 'Comments are disabled for this project', 403);
    }

    // 如果是回复，验证父评论是否存在
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return errorResponse(res, 'Parent comment not found', 404);
      }
    }

    // 创建评论
    const comment = await Comment.create({
      content,
      author: req.user?._id,
      project: projectId,
      parent: parentId || null,
    });

    await comment.populate('author', 'username avatar');

    successResponse(res, comment, 'Comment created successfully', 201);
  } catch (error: any) {
    console.error('Create comment error:', error);
    errorResponse(res, error.message || 'Failed to create comment', 500);
  }
};

/**
 * 获取项目的评论
 * GET /api/comments/project/:projectId
 */
export const getProjectComments = async (req: AuthRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // 只获取顶级评论（没有父评论的）
    const comments = await Comment.find({
      project: projectId,
      parent: null,
    })
      .populate('author', 'username avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'username avatar' },
      })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean();

    const total = await Comment.countDocuments({ project: projectId, parent: null });

    successResponse(res, {
      comments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    }, 'Comments fetched successfully');
  } catch (error: any) {
    console.error('Get comments error:', error);
    errorResponse(res, error.message || 'Failed to fetch comments', 500);
  }
};

/**
 * 删除评论
 * DELETE /api/comments/:id
 */
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return errorResponse(res, 'Comment not found', 404);
    }

    // 只有评论作者才能删除
    if (comment.author.toString() !== req.user?._id?.toString()) {
      return errorResponse(res, 'Not authorized to delete this comment', 403);
    }

    // 同时删除所有回复
    await Comment.deleteMany({ parent: comment._id });
    await comment.deleteOne();

    successResponse(res, null, 'Comment deleted successfully');
  } catch (error: any) {
    console.error('Delete comment error:', error);
    errorResponse(res, error.message || 'Failed to delete comment', 500);
  }
};
