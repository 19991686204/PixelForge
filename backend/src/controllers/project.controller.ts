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

    // 调试日志
    console.log('=== Create Project ===');
    console.log('Files received:', files?.length);
    if (files && files.length > 0) {
      files.forEach((file, index) => {
        console.log(`File ${index}:`, file.originalname, file.mimetype, file.size);
      });
    }

    // 验证文件
    if (!files || files.length === 0) {
      console.log('Error: No files received');
      return errorResponse(res, 'At least one image or video is required', 400);
    }

    // 分离图片和视频文件
    const imageFiles = files.filter(file => file.mimetype.startsWith('image/'));
    const videoFiles = files.filter(file => file.mimetype.startsWith('video/'));

    // 使用 Cloudinary 返回的 URL（multer-storage-cloudinary 已经上传了文件）
    console.log('Getting image URLs from Cloudinary...');
    const imageUrls = imageFiles.map(file => file.path);
    console.log('Images uploaded successfully:', imageUrls.length);

    // 使用 Cloudinary 返回的 URL（multer-storage-cloudinary 已经上传了文件）
    console.log('Getting video URLs from Cloudinary...');
    const videoUrls = videoFiles.map(file => file.path);
    console.log('Videos uploaded successfully:', videoUrls.length);

    // 确定封面图片
    let coverImage = '';
    if (imageUrls.length > 0) {
      // 优先使用上传的图片
      coverImage = imageUrls[0];
    } else if (videoUrls.length > 0) {
      // 如果没有图片，使用视频的第一帧作为封面
      // Cloudinary 视频URL默认带有 ?resource_type=video，需要转换为图片格式
      coverImage = videoUrls[0].replace('/video/', '/image/').replace('.mp4', '.jpg').replace('.mov', '.jpg').replace('.avi', '.jpg').replace('.mkv', '.jpg').replace('.webm', '.jpg');
      console.log('Using video thumbnail as cover:', coverImage);
    } else {
      return errorResponse(res, 'At least one image or video is required', 400);
    }

    // 创建项目
    const project = await Project.create({
      title,
      description,
      category,
      tags: tags ? sanitizeTags(JSON.parse(tags)) : [],
      tools: tools ? JSON.parse(tools) : [],
      client,
      projectUrl,
      coverImage,
      images: imageUrls,
      videos: videoUrls,
      designer: req.user?._id,
      status: 'published',
    });

    // 填充设计师信息
    await project.populate('designer', 'username avatar');

    console.log('Project created successfully:', project._id);
    successResponse(res, project, 'Project created successfully', 201);
  } catch (error: any) {
    console.error('Create project error:', error);
    console.error('Error stack:', error.stack);
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

    console.log('Get projects - Total projects:', projects.length);
    if (projects.length > 0) {
      console.log('Get projects - First project likes:', projects[0].likes);
      console.log('Get projects - First project saved:', projects[0].saved);
    }

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
    
    console.log('Toggle like - Project ID:', project._id);
    console.log('Toggle like - User ID:', userId);
    console.log('Toggle like - Current likes:', project.likes);
    
    const likeIndex = project.likes.findIndex(id => id.toString() === userId.toString());

    if (likeIndex > -1) {
      // 取消点赞
      project.likes.splice(likeIndex, 1);
    } else {
      // 点赞
      project.likes.push(userId as any);
    }

    console.log('Toggle like - Updated likes:', project.likes);
    
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
    
    console.log('Toggle save - Project ID:', project._id);
    console.log('Toggle save - User ID:', userId);
    console.log('Toggle save - Current saved:', project.saved);
    
    const saveIndex = project.saved.findIndex(id => id.toString() === userId.toString());

    if (saveIndex > -1) {
      // 取消收藏
      project.saved.splice(saveIndex, 1);
    } else {
      // 收藏
      project.saved.push(userId as any);
    }

    console.log('Toggle save - Updated saved:', project.saved);
    
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

/**
 * 获取用户点赞的项目
 * GET /api/projects/liked
 */
export const getLikedProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const projects = await Project.find({
      status: 'published',
      isPrivate: false,
      likes: userId
    })
      .populate('designer', 'username avatar')
      .sort({ createdAt: -1 })
      .lean();

    successResponse(res, projects, 'Liked projects fetched successfully');
  } catch (error: any) {
    console.error('Get liked projects error:', error);
    errorResponse(res, error.message || 'Failed to fetch liked projects', 500);
  }
};

/**
 * 获取用户收藏的项目
 * GET /api/projects/saved
 */
export const getSavedProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return errorResponse(res, 'Authentication required', 401);
    }

    const projects = await Project.find({
      status: 'published',
      isPrivate: false,
      saved: userId
    })
      .populate('designer', 'username avatar')
      .sort({ createdAt: -1 })
      .lean();

    successResponse(res, projects, 'Saved projects fetched successfully');
  } catch (error: any) {
    console.error('Get saved projects error:', error);
    errorResponse(res, error.message || 'Failed to fetch saved projects', 500);
  }
};
