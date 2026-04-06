import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';
import Project from '../models/Project.model';
import Follow from '../models/Follow.model';
import cloudinary from '../config/cloudinary.config';
import { successResponse, errorResponse } from '../utils/response.util';

/**
 * 获取用户资料
 * GET /api/users/:username
 */
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')
      .lean();

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // 获取用户的项目
    const projects = await Project.find({
      designer: user._id,
      status: 'published',
      isPrivate: false,
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .lean();

    // 检查当前用户是否关注了该用户
    let isFollowing = false;
    if (req.user?._id) {
      const follow = await Follow.findOne({
        follower: req.user._id,
        following: user._id,
      });
      isFollowing = !!follow;
    }

    successResponse(res, {
      user,
      projects,
      isFollowing,
    }, 'User profile fetched successfully');
  } catch (error: any) {
    console.error('Get user profile error:', error);
    errorResponse(res, error.message || 'Failed to fetch user profile', 500);
  }
};

/**
 * 更新用户资料
 * PUT /api/users/profile
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const {
      displayName,
      bio,
      skills,
      location,
      website,
      social,
    } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // 上传头像
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'pixelforge/avatars',
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          { quality: 'auto' },
        ],
      });
      user.avatar = result.secure_url;
    }

    // 更新字段
    if (displayName) user.displayName = displayName;
    if (bio) user.bio = bio;
    if (skills) user.skills = JSON.parse(skills);
    if (location) user.location = location;
    if (website) user.website = website;
    if (social) user.social = JSON.parse(social);

    await user.save();

    successResponse(res, user, 'Profile updated successfully');
  } catch (error: any) {
    console.error('Update profile error:', error);
    errorResponse(res, error.message || 'Failed to update profile', 500);
  }
};

/**
 * 关注/取消关注用户
 * POST /api/users/:userId/follow
 */
export const toggleFollow = async (req: AuthRequest, res: Response) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user?._id;
    
    if (!currentUserId) {
      return errorResponse(res, 'Authentication required', 401);
    }

    // 确保 targetUserId 是字符串类型
    if (Array.isArray(targetUserId)) {
      return errorResponse(res, 'Invalid user ID', 400);
    }

    if (targetUserId === currentUserId.toString()) {
      return errorResponse(res, 'Cannot follow yourself', 400);
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return errorResponse(res, 'User not found', 404);
    }

    // 检查是否已关注
    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: new mongoose.Types.ObjectId(targetUserId),
    });

    if (existingFollow) {
      // 取消关注
      await existingFollow.deleteOne();

      successResponse(res, { isFollowing: false }, 'Unfollowed successfully');
    } else {
      // 关注
      await Follow.create({
        follower: currentUserId,
        following: new mongoose.Types.ObjectId(targetUserId),
      });

      successResponse(res, { isFollowing: true }, 'Followed successfully');
    }

    // 更新统计数据（异步）
    const currentUser = await User.findById(currentUserId);
    if (currentUser) currentUser.updateStats();
    targetUser.updateStats();
  } catch (error: any) {
    console.error('Toggle follow error:', error);
    errorResponse(res, error.message || 'Failed to toggle follow', 500);
  }
};

/**
 * 获取用户的关注列表
 * GET /api/users/:userId/following
 */
export const getFollowing = async (req: AuthRequest, res: Response) => {
  try {
    const follows = await Follow.find({ follower: req.params.userId })
      .populate('following', 'username avatar bio stats')
      .sort({ createdAt: -1 })
      .lean();

    const following = follows.map(f => f.following);

    successResponse(res, following, 'Following list fetched successfully');
  } catch (error: any) {
    console.error('Get following error:', error);
    errorResponse(res, error.message || 'Failed to fetch following list', 500);
  }
};

/**
 * 获取用户的粉丝列表
 * GET /api/users/:userId/followers
 */
export const getFollowers = async (req: AuthRequest, res: Response) => {
  try {
    const follows = await Follow.find({ following: req.params.userId })
      .populate('follower', 'username avatar bio stats')
      .sort({ createdAt: -1 })
      .lean();

    const followers = follows.map(f => f.follower);

    successResponse(res, followers, 'Followers list fetched successfully');
  } catch (error: any) {
    console.error('Get followers error:', error);
    errorResponse(res, error.message || 'Failed to fetch followers list', 500);
  }
};

/**
 * 获取热门设计师
 * GET /api/users/top-designers
 */
export const getTopDesigners = async (req: AuthRequest, res: Response) => {
  try {
    const { limit = 10 } = req.query;

    const designers = await User.find({
      role: 'designer',
      isActive: true,
    })
      .sort({ 'stats.followers': -1, 'stats.projects': -1 })
      .limit(Number(limit))
      .select('username avatar bio stats')
      .lean();

    successResponse(res, designers, 'Top designers fetched successfully');
  } catch (error: any) {
    console.error('Get top designers error:', error);
    errorResponse(res, error.message || 'Failed to fetch top designers', 500);
  }
};
