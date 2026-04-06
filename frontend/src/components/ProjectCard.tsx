// 项目卡片组件
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    coverImage: string;
    designer: {
      _id: string;
      username: string;
      avatar: string;
    };
    likes: string[];
    views: number;
    category: string;
    saved?: string[];
  };
  onLike?: () => void;
  onFollow?: () => void;
  onSave?: () => void;
  isFollowing?: boolean;
  isSaved?: boolean;
  isLiked?: boolean;
  clickable?: boolean;
  linkTo?: string;
}

export default function ProjectCard({ project, onLike, onFollow, onSave, isFollowing = false, isSaved = false, isLiked = false, clickable = true, linkTo }: ProjectCardProps) {
  const { user, isAuthenticated } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // 使用传入的 isLiked 属性，如果没有则根据用户状态计算
  const finalIsLiked = isLiked !== undefined ? isLiked : (user ? project.likes.includes(user.id) : false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAuthenticated && onLike) {
      onLike();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ y: -4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative rounded-xl overflow-hidden"
      style={{
        backgroundColor: '#141414',
        border: '1px solid #262626',
        minHeight: '280px',
      }}
    >
      {clickable ? (
        <Link to={linkTo || `/project/${project._id}`} style={{ display: 'block', width: '100%', height: '100%', textDecoration: 'none' }}>
          {/* 图片容器 */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', borderRadius: '8px' }}>
            {/* 骨架屏 */}
            {!imageLoaded && (
              <div
                className="absolute inset-0 animate-pulse"
                style={{ backgroundColor: '#1a1a1a' }}
              />
            )}

            {/* 项目封面 */}
            <img
              src={project.coverImage}
              alt={project.title}
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                opacity: imageLoaded ? 1 : 0,
              }}
            />

            {/* 悬停遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            >
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* 设计师信息 */}
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={project.designer.avatar || `https://ui-avatars.com/api/?name=${project.designer.username}`}
                    alt={project.designer.username}
                    className="w-8 h-8 rounded-full"
                    style={{ border: '2px solid #6366f1' }}
                  />
                  <span className="text-sm font-medium text-white">
                    {project.designer.username}
                  </span>
                  {isAuthenticated && onFollow && (
                    <motion.button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onFollow();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-auto px-3 py-1 rounded-full text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: isFollowing ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                        color: isFollowing ? '#ef4444' : '#a78bfa',
                        border: `1px solid ${isFollowing ? '#ef4444' : '#a78bfa'}`,
                      }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </motion.button>
                  )}
                </div>

                {/* 项目标题 */}
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {project.title}
                </h3>

                {/* 分类标签 */}
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    color: '#a78bfa',
                  }}
                >
                  {project.category}
                </span>
              </div>
            </motion.div>

            {/* 操作按钮 */}
            {isAuthenticated && (
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                {/* 点赞按钮 */}
                <motion.button
                  onClick={handleLike}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.8,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all"
                  style={{
                    backgroundColor: finalIsLiked ? '#ef4444' : 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill={finalIsLiked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: finalIsLiked ? '#ffffff' : '#ffffff' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </motion.button>

                {/* 收藏按钮 */}
                {onSave && (
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSave();
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1 : 0.8,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all"
                    style={{
                      backgroundColor: isSaved ? '#f59e0b' : 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={isSaved ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: isSaved ? '#ffffff' : '#ffffff' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {/* 底部信息栏 */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm" style={{ color: '#9ca3af' }}>
              {/* 点赞数 */}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                {project.likes.length}
              </span>

              {/* 浏览量 */}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {project.views}
              </span>
            </div>
          </div>
        </Link>
      ) : (
        <div>
          {/* 图片容器 */}
          <div className="relative overflow-hidden" style={{ aspectRatio: '1/1', borderRadius: '8px' }}>
            {/* 骨架屏 */}
            {!imageLoaded && (
              <div
                className="absolute inset-0 animate-pulse"
                style={{ backgroundColor: '#1a1a1a' }}
              />
            )}

            {/* 项目封面 */}
            <img
              src={project.coverImage}
              alt={project.title}
              onLoad={() => setImageLoaded(true)}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                opacity: imageLoaded ? 1 : 0,
              }}
            />

            {/* 悬停遮罩 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            >
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {/* 设计师信息 */}
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={project.designer.avatar || `https://ui-avatars.com/api/?name=${project.designer.username}`}
                    alt={project.designer.username}
                    className="w-8 h-8 rounded-full"
                    style={{ border: '2px solid #6366f1' }}
                  />
                  <span className="text-sm font-medium text-white">
                    {project.designer.username}
                  </span>
                  {isAuthenticated && onFollow && (
                    <motion.button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onFollow();
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-auto px-3 py-1 rounded-full text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: isFollowing ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                        color: isFollowing ? '#ef4444' : '#a78bfa',
                        border: `1px solid ${isFollowing ? '#ef4444' : '#a78bfa'}`,
                      }}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </motion.button>
                  )}
                </div>

                {/* 项目标题 */}
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {project.title}
                </h3>

                {/* 分类标签 */}
                <span
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    color: '#a78bfa',
                  }}
                >
                  {project.category}
                </span>
              </div>
            </motion.div>

            {/* 操作按钮 */}
            {isAuthenticated && (
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                {/* 点赞按钮 */}
                <motion.button
                  onClick={handleLike}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.8,
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all"
                  style={{
                    backgroundColor: finalIsLiked ? '#ef4444' : 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill={finalIsLiked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: finalIsLiked ? '#ffffff' : '#ffffff' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </motion.button>

                {/* 收藏按钮 */}
                {onSave && (
                  <motion.button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSave();
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      scale: isHovered ? 1 : 0.8,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all"
                    style={{
                      backgroundColor: isSaved ? '#f59e0b' : 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill={isSaved ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: isSaved ? '#ffffff' : '#ffffff' }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {/* 底部信息栏 */}
          <div className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm" style={{ color: '#9ca3af' }}>
              {/* 点赞数 */}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                {project.likes.length}
              </span>

              {/* 浏览量 */}
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {project.views}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
