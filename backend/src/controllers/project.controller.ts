import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Project from '../models/Project.model';
import User from '../models/User.model';
import cloudinary from '../config/cloudinary.config';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.util';
import { sanitizeTags } from '../utils/validation.util';

/**
 * 创建项目
 * POST /api/projects
 */
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, tags, tools, client, projectUrl } = req.body;
    const files = req.files as Express.Multer.File[];

    // 验证文件
    if (!files || files.length === 0) {
      return errorResponse(res, 'At least one image is required', 400);
    }

    // 上传图片到 Cloudinary
    const uploadPromises = files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: 'pixelforge/projects',
        transformation: [
          { width: 1200, height: 900, crop: 'limit' }, // 限制最大尺寸
          { quality: 'auto' }, // 自动优化质量
        ],
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map(result => result.secure_url);

    // 创建项目
    const project = await Project.create({
      title,
      description,
      category,
      tags: tags ? sanitizeTags(JSON.parse(tags)) : [],
      tools: tools ? JSON.parse(tools) : [],
      client,
      projectUrl,
      coverImage: imageUrls[0],
      images: imageUrls,
      designer: req.user?._id,
      status: 'published',
    });

    // 填充设计师信息
    await project.populate('designer', 'username avatar');

    successResponse(res, project, 'Project created successfully', 201);
  } catch (error: any) {
    console.error('Create project error:', error);
    errorResponse(res, error.message || 'Failed to create project', 500);
  }
};

/**
 * 获取所有项目（带分页和筛选）
 * GET /api/projects
 */
export const getAllProjects = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sort = '-createdAt',
      designer,
      featured,
    } = req.query;

    // 构建查询条件
    const query: any = { status: 'published', isPrivate: false };

    if (category) {
      query.category = category;
    }

    if (designer) {
      query.designer = designer;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    // 执行查询
    const projects = await Project.find(query)
      .populate('designer', 'username avatar bio')
      .sort(sort as string)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .lean(); // 返回普通 JS 对象，提高性能

    const total = await Project.countDocuments(query);

    paginatedResponse(res, projects, Number(page), Number(limit), total);
  } catch (error: any) {
    console.error('Get projects error:', error);
    errorResponse(res, error.message || 'Failed to fetch projects', 500);
  }
};

/**
 * 获取单个项目详情
 * GET /api/projects/:id
 */
export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('designer', 'username avatar bio skills location social stats')
      .populate({
        path: 'comments',
        populate: { path: 'author', select: 'username avatar' },
        options: { sort: { createdAt: -1 }, limit: 10 },
      });

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    // 检查是否为私密项目
    if (project.isPrivate && project.designer._id.toString() !== req.user?._id?.toString()) {
      return errorResponse(res, 'This project is private', 403);
    }

    // 增加浏览量（异步，不阻塞响应）
    project.incrementViews().catch((err: any) => console.error('Failed to increment views:', err));

    successResponse(res, project, 'Project fetched successfully');
  } catch (error: any) {
    console.error('Get project error:', error);
    errorResponse(res, error.message || 'Failed to fetch project', 500);
  }
};

/**
 * 更新项目
 * PUT /api/projects/:id
 */
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, tags, tools, status, isPrivate } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    // 更新字段
    if (title) project.title = title;
    if (description) project.description = description;
    if (category) project.category = category;
    if (tags) project.tags = sanitizeTags(JSON.parse(tags));
    if (tools) project.tools = JSON.parse(tools);
    if (status) project.status = status;
    if (typeof isPrivate !== 'undefined') project.isPrivate = isPrivate;

    await project.save();

    successResponse(res, project, 'Project updated successfully');
  } catch (error: any) {
    console.error('Update project error:', error);
    errorResponse(res, error.message || 'Failed to update project', 500);
  }
};

/**
 * 删除项目
 * DELETE /api/projects/:id
 */
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    // 删除 Cloudinary 上的图片
    const deletePromises = project.images.map(imageUrl => {
      const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
      return cloudinary.uploader.destroy(publicId);
    });

    await Promise.all(deletePromises);

    // 删除项目
    await project.deleteOne();

    successResponse(res, null, 'Project deleted successfully');
  } catch (error: any) {
    console.error('Delete project error:', error);
    errorResponse(res, error.message || 'Failed to delete project', 500);
  }
};

/**
 * 点赞/取消点赞项目
 * POST /api/projects/:id/like
 */
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    const userId = req.user?._id;
    if (!userId) {
      return errorResponse(res, 'Authentication required', 401);
    }
    const likeIndex = project.likes.findIndex(id => id.toString() === userId.toString());

    if (likeIndex > -1) {
      // 取消点赞
      project.likes.splice(likeIndex, 1);
    } else {
      // 点赞
      project.likes.push(userId as any);
    }

    await project.save();

    successResponse(res, {
      likes: project.likes.length,
      isLiked: likeIndex === -1,
    }, 'Like toggled successfully');
  } catch (error: any) {
    console.error('Toggle like error:', error);
    errorResponse(res, error.message || 'Failed to toggle like', 500);
  }
};

/**
 * 收藏/取消收藏项目
 * POST /api/projects/:id/save
 */
export const toggleSave = async (req: AuthRequest, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return errorResponse(res, 'Project not found', 404);
    }

    const userId = req.user?._id;
    if (!userId) {
      return errorResponse(res, 'Authentication required', 401);
    }
    const saveIndex = project.saved.findIndex(id => id.toString() === userId.toString());

    if (saveIndex > -1) {
      // 取消收藏
      project.saved.splice(saveIndex, 1);
    } else {
      // 收藏
      project.saved.push(userId as any);
    }

    await project.save();

    successResponse(res, {
      saves: project.saved.length,
      isSaved: saveIndex === -1,
    }, 'Save toggled successfully');
  } catch (error: any) {
    console.error('Toggle save error:', error);
    errorResponse(res, error.message || 'Failed to toggle save', 500);
  }
};

/**
 * 获取热门项目
 * GET /api/projects/trending
 */
export const getTrendingProjects = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const projects = await Project.find({
      status: 'published',
      isPrivate: false,
    })
      .sort({ views: -1, 'likes': -1 })
      .limit(Number(limit))
      .populate('designer', 'username avatar')
      .lean();

    successResponse(res, projects, 'Trending projects fetched successfully');
  } catch (error: any) {
    console.error('Get trending projects error:', error);
    errorResponse(res, error.message || 'Failed to fetch trending projects', 500);
  }
};
