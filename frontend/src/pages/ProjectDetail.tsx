import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { UserAvatar, Badge, LoadingSpinner, ConfirmDialog, Logo } from '../components';

// 模拟的项目数据，与示例页面中的数据匹配
const mockProjects = [
  {
    _id: '1',
    title: 'Mountain Landscape',
    description: 'A beautiful mountain landscape with clear blue sky and snow-capped peaks.',
    category: 'Photography',
    tags: ['landscape', 'nature', 'photography'],
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/sample.jpg',
    images: ['https://res.cloudinary.com/demo/image/upload/v1483486867/sample.jpg'],
    videos: [],
    tools: ['Photoshop', 'Lightroom'],
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg',
      bio: 'Cloudinary is a cloud-based service that provides an end-to-end image and video management solution.',
      skills: ['Photography', 'Image Editing'],
      location: 'San Francisco, CA',
      stats: {
        projects: 8,
        followers: 1000,
        following: 200
      }
    },
    likes: [],
    views: 1000,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    _id: '2',
    title: 'Coffee Cup',
    description: 'A close-up of a coffee cup with steam rising, perfect for coffee enthusiasts.',
    category: 'Still Life',
    tags: ['coffee', 'still life', 'photography'],
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/coffee.jpg',
    images: ['https://res.cloudinary.com/demo/image/upload/v1483486867/coffee.jpg'],
    videos: [],
    tools: ['Photoshop', 'Lightroom'],
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg',
      bio: 'Cloudinary is a cloud-based service that provides an end-to-end image and video management solution.',
      skills: ['Photography', 'Image Editing'],
      location: 'San Francisco, CA',
      stats: {
        projects: 8,
        followers: 1000,
        following: 200
      }
    },
    likes: [],
    views: 850,
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    _id: '3',
    title: 'Woman with Sunglasses',
    description: 'A stylish woman wearing sunglasses, captured in a candid moment.',
    category: 'Portrait',
    tags: ['portrait', 'fashion', 'photography'],
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/woman.jpg',
    images: ['https://res.cloudinary.com/demo/image/upload/v1483486867/woman.jpg'],
    videos: [],
    tools: ['Photoshop', 'Lightroom'],
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg',
      bio: 'Cloudinary is a cloud-based service that provides an end-to-end image and video management solution.',
      skills: ['Photography', 'Image Editing'],
      location: 'San Francisco, CA',
      stats: {
        projects: 8,
        followers: 1000,
        following: 200
      }
    },
    likes: [],
    views: 1200,
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    _id: '4',
    title: 'Green Tree',
    description: 'A lush green tree standing tall against a clear blue sky.',
    category: 'Nature',
    tags: ['tree', 'nature', 'photography'],
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/tree.jpg',
    images: ['https://res.cloudinary.com/demo/image/upload/v1483486867/tree.jpg'],
    videos: [],
    tools: ['Photoshop', 'Lightroom'],
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg',
      bio: 'Cloudinary is a cloud-based service that provides an end-to-end image and video management solution.',
      skills: ['Photography', 'Image Editing'],
      location: 'San Francisco, CA',
      stats: {
        projects: 8,
        followers: 1000,
        following: 200
      }
    },
    likes: [],
    views: 750,
    createdAt: '2024-01-04T00:00:00Z'
  },
  {
    _id: '5',
    title: 'Yellow Flower',
    description: 'A vibrant yellow flower in full bloom, showcasing nature\'s beauty.',
    category: 'Nature',
    tags: ['flower', 'nature', 'photography'],
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/flower.jpg',
    images: ['https://res.cloudinary.com/demo/image/upload/v1483486867/flower.jpg'],
    videos: [],
    tools: ['Photoshop', 'Lightroom'],
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg',
      bio: 'Cloudinary is a cloud-based service that provides an end-to-end image and video management solution.',
      skills: ['Photography', 'Image Editing'],
      location: 'San Francisco, CA',
      stats: {
        projects: 8,
        followers: 1000,
        following: 200
      }
    },
    likes: [],
    views: 900,
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    _id: '6',
    title: 'Business Team',
    description: 'A professional business team collaborating in a modern office setting.',
    category: 'Corporate',
    tags: ['business', 'team', 'corporate'],
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/business.jpg',
    images: ['https://res.cloudinary.com/demo/image/upload/v1483486867/business.jpg'],
    videos: [],
    tools: ['Photoshop', 'Lightroom'],
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg',
      bio: 'Cloudinary is a cloud-based service that provides an end-to-end image and video management solution.',
      skills: ['Photography', 'Image Editing'],
      location: 'San Francisco, CA',
      stats: {
        projects: 8,
        followers: 1000,
        following: 200
      }
    },
    likes: [],
    views: 1100,
    createdAt: '2024-01-06T00:00:00Z'
  },
  {
    _id: '7',
    title: 'Ocean Waves',
    description: 'A mesmerizing video of ocean waves crashing against the shore.',
    category: 'Nature',
    tags: ['ocean', 'waves', 'video'],
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1556710598/ocean_waves.jpg',
    images: ['https://res.cloudinary.com/demo/image/upload/v1556710598/ocean_waves.jpg'],
    videos: ['https://res.cloudinary.com/demo/video/upload/v1556710598/ocean_waves.mp4'],
    tools: ['Premiere Pro', 'After Effects'],
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg',
      bio: 'Cloudinary is a cloud-based service that provides an end-to-end image and video management solution.',
      skills: ['Video Editing', 'Motion Graphics'],
      location: 'San Francisco, CA',
      stats: {
        projects: 8,
        followers: 1000,
        following: 200
      }
    },
    likes: [],
    views: 1500,
    createdAt: '2024-01-07T00:00:00Z'
  },
  {
    _id: '8',
    title: 'City Skyline',
    description: 'A stunning time-lapse video of a city skyline at dusk.',
    category: 'Urban',
    tags: ['city', 'skyline', 'video'],
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1556710598/city_skyline.jpg',
    images: ['https://res.cloudinary.com/demo/image/upload/v1556710598/city_skyline.jpg'],
    videos: ['https://res.cloudinary.com/demo/video/upload/v1556710598/city_skyline.mp4'],
    tools: ['Premiere Pro', 'After Effects'],
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg',
      bio: 'Cloudinary is a cloud-based service that provides an end-to-end image and video management solution.',
      skills: ['Video Editing', 'Motion Graphics'],
      location: 'San Francisco, CA',
      stats: {
        projects: 8,
        followers: 1000,
        following: 200
      }
    },
    likes: [],
    views: 1300,
    createdAt: '2024-01-08T00:00:00Z'
  }
];

interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
  likes: string[];
  replies?: Comment[];
}

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  coverImage: string;
  images: string[];
  videos?: string[];
  tools?: string[];
  projectUrl?: string;
  designer: {
    _id: string;
    username: string;
    avatar: string;
    bio: string;
    skills: string[];
    location: string;
    stats: {
      projects: number;
      followers: number;
      following: number;
    };
  };
  likes: string[];
  views: number;
  createdAt: string;
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const savedComments = localStorage.getItem(`comments_${id}`);
      return savedComments ? JSON.parse(savedComments) : [];
    } catch (error) {
      console.error('Failed to load comments from localStorage:', error);
      return [];
    }
  });
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    fetchProject();
    fetchComments();
  }, [id]);

  const fetchProject = async () => {
    try {
      // 从本地存储获取状态
      let likedProjects: string[] = [];
      let savedProjects: string[] = [];
      let followingDesigners: string[] = [];
      
      try {
        likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
        savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        followingDesigners = JSON.parse(localStorage.getItem('followingDesigners') || '[]');
      } catch (localStorageError) {
        console.error('Failed to load state from localStorage:', localStorageError);
      }
      
      // 尝试从后端获取项目
      const response = await api.get(`/projects/${id}`);
      const data = response.data.data;
      setProject(data);
      setLikeCount(data.likes.length);
      // 优先使用本地存储中的点赞状态
      setIsLiked(id ? likedProjects.includes(id) : false);
      // 使用本地存储中的收藏状态
      setIsSaved(id ? savedProjects.includes(id) : false);
      // 使用本地存储中的关注状态
      setIsFollowing(followingDesigners.includes(data.designer._id));
    } catch (error) {
      console.error('Failed to fetch project:', error);
      // 后端没有找到项目，使用前端模拟数据
      const mockProject = mockProjects.find(p => p._id === id);
      if (mockProject) {
        // 从本地存储获取点赞、收藏和关注状态
          try {
            const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
            const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
            const followingDesigners = JSON.parse(localStorage.getItem('followingDesigners') || '[]');
            
            // 更新模拟项目的点赞状态
            const updatedMockProject = {
              ...mockProject,
              likes: likedProjects.includes(id) ? [user?.id || '1'] : []
            };
            
            setProject(updatedMockProject);
            setLikeCount(updatedMockProject.likes.length);
            setIsLiked(likedProjects.includes(id));
            setIsSaved(savedProjects.includes(id));
            setIsFollowing(followingDesigners.includes(mockProject.designer._id));
          } catch (localStorageError) {
            console.error('Failed to load state from localStorage:', localStorageError);
            setProject(mockProject);
            setLikeCount(mockProject.likes.length);
            setIsLiked(false);
            setIsSaved(false);
            setIsFollowing(false);
          }
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      // 检查是否是示例项目（示例项目的设计师 ID 为 '1'）
      const isExampleProject = project?.designer._id === '1';
      
      if (isExampleProject) {
        // 对于示例项目，从本地存储加载评论
        try {
          const savedComments = localStorage.getItem(`comments_${id}`);
          if (savedComments) {
            setComments(JSON.parse(savedComments));
          }
        } catch (localStorageError) {
          console.error('Failed to load comments from localStorage:', localStorageError);
        }
      } else {
        // 对于真实项目，从后端获取评论
        const response = await api.get(`/comments/project/${id}`);
        setComments(response.data.data.comments);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated || !id) {
      navigate('/login');
      return;
    }

    try {
      // 尝试调用后端 API
      const response = await api.post(`/projects/${id}/like`);
      const newIsLiked = response.data.data.isLiked;
      setIsLiked(newIsLiked);
      setLikeCount(response.data.data.likes);
      
      // 同时更新本地存储，确保状态持久化
      try {
        const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
        const updatedLiked = newIsLiked
          ? [...likedProjects, id]
          : likedProjects.filter((projectId: string) => projectId !== id);
        localStorage.setItem('likedProjects', JSON.stringify(updatedLiked));
      } catch (localStorageError) {
        console.error('Failed to update likedProjects in localStorage:', localStorageError);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // 后端 API 失败，更新本地存储
      try {
        const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
        const newIsLiked = !isLiked;
        const updatedLiked = newIsLiked
          ? [...likedProjects, id]
          : likedProjects.filter((projectId: string) => projectId !== id);
        localStorage.setItem('likedProjects', JSON.stringify(updatedLiked));
        
        // 更新本地状态
        setIsLiked(newIsLiked);
        setLikeCount(newIsLiked ? likeCount + 1 : likeCount - 1);
      } catch (localStorageError) {
        console.error('Failed to update likedProjects in localStorage:', localStorageError);
      }
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated || !project) return;

    try {
      // 尝试调用后端 API
      const response = await api.post(`/users/${project.designer._id}/follow`);
      setIsFollowing(response.data.data.isFollowing);
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      // 后端 API 失败，更新本地存储
      try {
        const followingDesigners = JSON.parse(localStorage.getItem('followingDesigners') || '[]');
        const newIsFollowing = !isFollowing;
        const updatedFollowing = newIsFollowing
          ? [...followingDesigners, project.designer._id]
          : followingDesigners.filter((designerId: string) => designerId !== project.designer._id);
        localStorage.setItem('followingDesigners', JSON.stringify(updatedFollowing));
        
        // 更新本地状态
        setIsFollowing(newIsFollowing);
      } catch (localStorageError) {
        console.error('Failed to update followingDesigners in localStorage:', localStorageError);
      }
    }
  };

  // 处理收藏
  const handleSave = async () => {
    if (!isAuthenticated || !id) {
      navigate('/login');
      return;
    }

    try {
      // 尝试调用后端 API
      await api.post(`/projects/${id}/save`);
      // 由于后端 API 没有返回数据，我们直接切换状态
      const newIsSaved = !isSaved;
      setIsSaved(newIsSaved);
      
      // 同时更新本地存储，确保状态持久化
      try {
        const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        const updatedSaved = newIsSaved
          ? [...savedProjects, id]
          : savedProjects.filter((projectId: string) => projectId !== id);
        localStorage.setItem('savedProjects', JSON.stringify(updatedSaved));
      } catch (localStorageError) {
        console.error('Failed to update savedProjects in localStorage:', localStorageError);
      }
    } catch (error) {
      console.error('Failed to toggle save:', error);
      // 后端 API 失败，更新本地存储
      try {
        const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        const newIsSaved = !isSaved;
        const updatedSaved = newIsSaved
          ? [...savedProjects, id]
          : savedProjects.filter((projectId: string) => projectId !== id);
        localStorage.setItem('savedProjects', JSON.stringify(updatedSaved));
        
        // 更新本地状态
        setIsSaved(newIsSaved);
      } catch (localStorageError) {
        console.error('Failed to update savedProjects in localStorage:', localStorageError);
      }
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !isAuthenticated || !id || !user) return;

    setCommentLoading(true);
    try {
      // 检查是否是示例项目（示例项目的设计师 ID 为 '1'）
      const isExampleProject = project?.designer._id === '1';
      
      if (isExampleProject) {
        // 对于示例项目，直接在前端添加评论
        const newComment = {
          _id: `comment-${Date.now()}`,
          content: commentText,
          author: {
            _id: user.id,
            username: user.username,
            avatar: user.avatar || `https://ui-avatars.com/api/?name=${user.username}`
          },
          createdAt: new Date().toISOString(),
          likes: [],
          replies: []
        };
        
        // 更新本地存储
        setComments(prev => {
          const updatedComments = [newComment, ...prev];
          try {
            localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
          } catch (error) {
            console.error('Failed to save comments to localStorage:', error);
          }
          return updatedComments;
        });
        setCommentText('');
        setReplyTo(null);
      } else {
        // 对于真实项目，发送 API 请求
        const response = await api.post('/comments', {
          content: commentText,
          projectId: id,
          parentId: replyTo,
        });

        setComments(prev => [response.data.data, ...prev]);
        setCommentText('');
        setReplyTo(null);
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      // 检查是否是示例项目（示例项目的设计师 ID 为 '1'）
      const isExampleProject = project?.designer._id === '1';
      
      if (isExampleProject) {
        // 对于示例项目，直接在前端删除评论并更新本地存储
        setComments(prev => {
          const updatedComments = prev.filter(c => c._id !== commentId);
          try {
            localStorage.setItem(`comments_${id}`, JSON.stringify(updatedComments));
          } catch (error) {
            console.error('Failed to save comments to localStorage:', error);
          }
          return updatedComments;
        });
      } else {
        // 对于真实项目，发送 API 请求
        await api.delete(`/comments/${commentId}`);
        setComments(prev => prev.filter(c => c._id !== commentId));
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await api.delete(`/projects/${id}`);
      navigate('/dashboard/my-projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!project) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0a0a0a', color: '#e5e5e5' }}
      >
        <div className="text-center">
          <p className="text-xl mb-4">Project not found</p>
          <Link to="/dashboard">
            <button
              className="px-6 py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: '#6366f1' }}
            >
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user?.id === project.designer._id;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#e5e5e5' }}>
      {/* 顶部导航 */}
      <nav
        className="fixed top-0 w-full z-50 backdrop-blur-xl"
        style={{ 
          backgroundColor: 'rgba(10,10,10,0.9)', 
          borderBottom: '1px solid #262626',
          transition: 'all 0.3s ease',
          overflow: 'visible',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <Logo size="md" />
          </Link>

          {/* 右侧操作 */}
          <div className="flex items-center gap-3">
            {/* 点赞按钮 */}
            <motion.button
              onClick={handleLike}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: isLiked ? '#ef4444' : '#141414',
                border: `1px solid ${isLiked ? '#ef4444' : '#262626'}`,
                color: isLiked ? '#ffffff' : '#e5e5e5',
              }}
            >
              <svg
                className="w-5 h-5"
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{likeCount}</span>
            </motion.button>

            {/* 收藏按钮 */}
            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
              style={{
                backgroundColor: isSaved ? '#f59e0b' : '#141414',
                border: `1px solid ${isSaved ? '#f59e0b' : '#262626'}`,
                color: isSaved ? '#ffffff' : '#e5e5e5',
              }}
            >
              <svg
                className="w-5 h-5"
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
            </motion.button>

            {/* 分享按钮 */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied!');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
              style={{ backgroundColor: '#141414', border: '1px solid #262626' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span className="hidden sm:inline">Share</span>
            </button>

            {/* 所有者操作 */}
            {isOwner && (
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#ef4444',
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="pt-20 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {/* 项目标题和信息 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-4xl sm:text-5xl font-black mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {project.title}
            </h1>

            {/* 设计师信息 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link to={`/profile/${project.designer.username}`}>
                  <img
                    src={project.designer.avatar || `https://ui-avatars.com/api/?name=${project.designer.username}`}
                    alt={project.designer.username}
                    className="w-14 h-14 rounded-full object-cover"
                    style={{ border: '2px solid #6366f1' }}
                  />
                </Link>
                <div>
                  <Link to={`/profile/${project.designer.username}`}>
                    <p className="font-semibold text-lg hover:text-indigo-400 transition-colors">
                      {project.designer.username}
                    </p>
                  </Link>
                  <p className="text-sm" style={{ color: '#9ca3af' }}>
                    {project.designer.location || 'Designer'}
                  </p>
                </div>
              </div>

              {/* 关注按钮 */}
              {isAuthenticated && !isOwner && (
                <button
                  onClick={handleFollow}
                  className="px-6 py-2.5 rounded-xl font-medium transition-all"
                  style={{
                    backgroundColor: isFollowing ? '#141414' : '#6366f1',
                    border: `1px solid ${isFollowing ? '#6366f1' : 'transparent'}`,
                    color: isFollowing ? '#6366f1' : '#ffffff',
                  }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </motion.div>

          {/* 图片和视频展示区 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-10"
          >
            {/* 主图/视频 */}
            <div className="rounded-2xl overflow-hidden mb-4">
              <AnimatePresence mode="wait">
                {project.images[activeImage] && (
                  <motion.img
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={project.images[activeImage]}
                    alt={`${project.title} - ${activeImage + 1}`}
                    className="w-full"
                  />
                )}
                {project.videos && project.videos.length > 0 && (
                  <motion.video
                    key={`video-${activeImage}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={project.videos[activeImage - project.images.length]}
                    className="w-full"
                    controls
                    autoPlay
                    muted
                    loop
                  />
                )}
              </AnimatePresence>
            </div>

            {/* 缩略图列表 */}
            {(project.images.length > 1 || (project.videos && project.videos.length > 0)) && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {/* 图片缩略图 */}
                {project.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all relative"
                    style={{
                      border: `2px solid ${activeImage === index ? '#6366f1' : '#262626'}`,
                      opacity: activeImage === index ? 1 : 0.6,
                    }}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                    {activeImage === index && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
                
                {/* 视频缩略图 */}
                {project.videos && project.videos.map((video, index) => {
                  const videoIndex = project.images.length + index;
                  return (
                    <button
                      key={`video-${index}`}
                      onClick={() => setActiveImage(videoIndex)}
                      className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden transition-all relative"
                      style={{
                        border: `2px solid ${activeImage === videoIndex ? '#6366f1' : '#262626'}`,
                        opacity: activeImage === videoIndex ? 1 : 0.6,
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center bg-black">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      {activeImage === videoIndex && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* 项目详情 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* 描述 */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About this project</h2>
              <p
                className="leading-relaxed text-lg"
                style={{ color: '#d1d5db', whiteSpace: 'pre-line' }}
              >
                {project.description}
              </p>
            </div>

            {/* 侧边信息 */}
            <div className="space-y-6">
              {/* 分类 */}
              <div
                className="rounded-xl p-5"
                style={{ backgroundColor: '#141414', border: '1px solid #262626' }}
              >
                <h3 className="text-sm font-medium mb-3" style={{ color: '#9ca3af' }}>
                  PROJECT INFO
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Category</p>
                    <Badge variant="primary">{project.category}</Badge>
                  </div>

                  <div>
                    <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Published</p>
                    <p className="text-sm">{formatDate(project.createdAt)}</p>
                  </div>

                  <div>
                    <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Views</p>
                    <p className="text-sm">{project.views.toLocaleString()}</p>
                  </div>

                  {project.projectUrl && (
                    <div>
                      <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Live URL</p>
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                        style={{ color: '#6366f1' }}
                      >
                        View Project →
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* 标签 */}
              {project.tags && project.tags.length > 0 && (
                <div
                  className="rounded-xl p-5"
                  style={{ backgroundColor: '#141414', border: '1px solid #262626' }}
                >
                  <h3 className="text-sm font-medium mb-3" style={{ color: '#9ca3af' }}>
                    TAGS
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: '#1a1a1a', color: '#9ca3af', border: '1px solid #262626' }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 使用工具 */}
              {project.tools && project.tools.length > 0 && (
                <div
                  className="rounded-xl p-5"
                  style={{ backgroundColor: '#141414', border: '1px solid #262626' }}
                >
                  <h3 className="text-sm font-medium mb-3" style={{ color: '#9ca3af' }}>
                    TOOLS USED
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tools.map((tool, i) => (
                      <Badge key={i} variant="info">{tool}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 评论区 */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: '#141414', border: '1px solid #262626' }}
          >
            <h2 className="text-2xl font-bold mb-6">
              Comments ({comments.length})
            </h2>

            {/* 发表评论 */}
            {isAuthenticated ? (
              <form onSubmit={handleComment} className="mb-8">
                <div className="flex gap-4">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username}`}
                    alt={user?.username}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                    style={{ border: '2px solid #6366f1' }}
                  />
                  <div className="flex-1">
                    {replyTo && (
                      <div
                        className="flex items-center justify-between px-3 py-2 rounded-lg mb-2 text-sm"
                        style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#a78bfa' }}
                      >
                        <span>Replying to comment</span>
                        <button
                          type="button"
                          onClick={() => setReplyTo(null)}
                          className="hover:opacity-70"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      maxLength={1000}
                      className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-all"
                      style={{
                        backgroundColor: '#0a0a0a',
                        border: '1px solid #262626',
                        color: '#e5e5e5',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                      onBlur={(e) => (e.target.style.borderColor = '#262626')}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs" style={{ color: '#6b7280' }}>
                        {commentText.length}/1000
                      </span>
                      <button
                        type="submit"
                        disabled={!commentText.trim() || commentLoading}
                        className="px-5 py-2 rounded-lg text-sm font-medium text-white transition-all"
                        style={{
                          backgroundColor: '#6366f1',
                          opacity: !commentText.trim() || commentLoading ? 0.5 : 1,
                        }}
                      >
                        {commentLoading ? 'Posting...' : 'Post Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div
                className="text-center py-6 rounded-xl mb-8"
                style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }}
              >
                <p className="mb-3" style={{ color: '#9ca3af' }}>
                  Sign in to leave a comment
                </p>
                <Link to="/login">
                  <button
                    className="px-6 py-2 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: '#6366f1' }}
                  >
                    Sign In
                  </button>
                </Link>
              </div>
            )}

            {/* 评论列表 */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-4xl mb-3">💬</p>
                  <p style={{ color: '#6b7280' }}>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4"
                  >
                    <Link to={`/profile/${comment.author.username}`}>
                      <img
                        src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.username}`}
                        alt={comment.author.username}
                        className="w-10 h-10 rounded-full flex-shrink-0"
                      />
                    </Link>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Link to={`/profile/${comment.author.username}`}>
                          <span className="font-medium hover:text-indigo-400 transition-colors">
                            {comment.author.username}
                          </span>
                        </Link>
                        <span className="text-xs" style={{ color: '#6b7280' }}>
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: '#d1d5db' }}
                      >
                        {comment.content}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <button
                          onClick={() => setReplyTo(comment._id)}
                          className="text-xs transition-colors hover:text-indigo-400"
                          style={{ color: '#6b7280' }}
                        >
                          Reply
                        </button>
                        {user?.id === comment.author._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-xs transition-colors hover:text-red-400"
                            style={{ color: '#6b7280' }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
      />
    </div>
  );
}
