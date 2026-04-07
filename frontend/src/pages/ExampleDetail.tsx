// 示例资产详情页面
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/logo';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

// 扩展 Cloudinary 示例数据，添加视频和更多分类
const cloudinaryAssets = [
  {
    _id: '1',
    title: 'Mountain Landscape',
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/sample.jpg',
    assetType: 'image',
    assetUrl: 'https://res.cloudinary.com/demo/image/upload/v1483486867/sample.jpg',
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg'
    },
    likes: [],
    views: 1000,
    category: 'Photography',
    description: 'A beautiful mountain landscape with clear blue sky and snow-capped peaks.'
  },
  {
    _id: '2',
    title: 'Coffee Cup',
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/coffee.jpg',
    assetType: 'image',
    assetUrl: 'https://res.cloudinary.com/demo/image/upload/v1483486867/coffee.jpg',
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg'
    },
    likes: [],
    views: 850,
    category: 'Still Life',
    description: 'A close-up of a coffee cup with steam rising, perfect for coffee enthusiasts.'
  },
  {
    _id: '3',
    title: 'Woman with Sunglasses',
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/woman.jpg',
    assetType: 'image',
    assetUrl: 'https://res.cloudinary.com/demo/image/upload/v1483486867/woman.jpg',
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg'
    },
    likes: [],
    views: 1200,
    category: 'Portrait',
    description: 'A stylish woman wearing sunglasses, captured in a candid moment.'
  },
  {
    _id: '4',
    title: 'Green Tree',
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/tree.jpg',
    assetType: 'image',
    assetUrl: 'https://res.cloudinary.com/demo/image/upload/v1483486867/tree.jpg',
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg'
    },
    likes: [],
    views: 750,
    category: 'Nature',
    description: 'A lush green tree standing tall against a clear blue sky.'
  },
  {
    _id: '5',
    title: 'Yellow Flower',
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/flower.jpg',
    assetType: 'image',
    assetUrl: 'https://res.cloudinary.com/demo/image/upload/v1483486867/flower.jpg',
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg'
    },
    likes: [],
    views: 900,
    category: 'Nature',
    description: 'A vibrant yellow flower in full bloom, showcasing nature\'s beauty.'
  },
  {
    _id: '6',
    title: 'Business Team',
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/business.jpg',
    assetType: 'image',
    assetUrl: 'https://res.cloudinary.com/demo/image/upload/v1483486867/business.jpg',
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg'
    },
    likes: [],
    views: 1100,
    category: 'Corporate',
    description: 'A professional business team collaborating in a modern office setting.'
  },
  {
    _id: '7',
    title: 'Ocean Waves',
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1556710598/ocean_waves.jpg',
    assetType: 'video',
    assetUrl: 'https://res.cloudinary.com/demo/video/upload/v1556710598/ocean_waves.mp4',
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg'
    },
    likes: [],
    views: 1500,
    category: 'Nature',
    description: 'A mesmerizing video of ocean waves crashing against the shore.'
  },
  {
    _id: '8',
    title: 'City Skyline',
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1556710598/city_skyline.jpg',
    assetType: 'video',
    assetUrl: 'https://res.cloudinary.com/demo/video/upload/v1556710598/city_skyline.mp4',
    designer: {
      _id: '1',
      username: 'Cloudinary',
      avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg'
    },
    likes: [],
    views: 1300,
    category: 'Urban',
    description: 'A stunning time-lapse video of a city skyline at dusk.'
  }
];

export default function ExampleDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [asset, setAsset] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // 从本地存储加载状态
  const [isLiked, setIsLiked] = useState(() => {
    try {
      const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
      return likedProjects.includes(id);
    } catch (error) {
      console.error('Failed to load isLiked from localStorage:', error);
      return false;
    }
  });
  const [isFollowing, setIsFollowing] = useState(() => {
    try {
      const followingDesigners = JSON.parse(localStorage.getItem('followingDesigners') || '[]');
      return followingDesigners.includes('1'); // Cloudinary 的设计师 ID
    } catch (error) {
      console.error('Failed to load isFollowing from localStorage:', error);
      return false;
    }
  });
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
      return savedProjects.includes(id);
    } catch (error) {
      console.error('Failed to load isSaved from localStorage:', error);
      return false;
    }
  });
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    // 模拟加载资产数据
    setTimeout(() => {
      const foundAsset = cloudinaryAssets.find(item => item._id === id);
      if (foundAsset) {
        setAsset(foundAsset);
        setLikes(foundAsset.likes.length);
        // 从本地存储加载状态，而不是重置
        try {
          const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
          setIsLiked(likedProjects.includes(id));
          
          const followingDesigners = JSON.parse(localStorage.getItem('followingDesigners') || '[]');
          setIsFollowing(followingDesigners.includes('1')); // Cloudinary 的设计师 ID
          
          const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
          setIsSaved(savedProjects.includes(id));
        } catch (error) {
          console.error('Failed to load state from localStorage:', error);
          setIsLiked(false);
          setIsFollowing(false);
          setIsSaved(false);
        }
      }
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl">Loading...</div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-4">Asset not found</h1>
        <Link 
          to="/examples" 
          className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          Back to Examples
        </Link>
      </div>
    );
  }

  // 处理点赞
  const handleLike = async () => {
    // 先更新本地状态，确保 UI 立即响应
    const newIsLiked = !isLiked;
    const newLikes = isLiked ? likes - 1 : likes + 1;
    setIsLiked(newIsLiked);
    setLikes(newLikes);
    
    // 更新本地存储
    try {
      const likedProjects = JSON.parse(localStorage.getItem('likedProjects') || '[]');
      const updatedLiked = newIsLiked
        ? [...likedProjects, asset._id]
        : likedProjects.filter((id: string) => id !== asset._id);
      localStorage.setItem('likedProjects', JSON.stringify(updatedLiked));
    } catch (error) {
      console.error('Failed to update likedProjects in localStorage:', error);
    }
    
    // 然后调用 API 同步到后端
    if (isAuthenticated) {
      try {
        await api.post(`/projects/${asset._id}/like`);
      } catch (error) {
        console.error('Failed to like project:', error);
        // 对于示例项目，不恢复状态，保持本地更新
        // 因为示例项目可能不存在于后端数据库中
      }
    }
  };

  // 处理关注
  const handleFollow = async () => {
    // 先更新本地状态，确保 UI 立即响应
    const newIsFollowing = !isFollowing;
    setIsFollowing(newIsFollowing);
    
    // 更新本地存储
    try {
      const followingDesigners = JSON.parse(localStorage.getItem('followingDesigners') || '[]');
      const updatedFollowing = newIsFollowing
        ? [...followingDesigners, asset.designer._id]
        : followingDesigners.filter((id: string) => id !== asset.designer._id);
      localStorage.setItem('followingDesigners', JSON.stringify(updatedFollowing));
    } catch (error) {
      console.error('Failed to update followingDesigners in localStorage:', error);
    }
    
    // 然后调用 API 同步到后端
    if (isAuthenticated) {
      try {
        await api.post(`/users/${asset.designer._id}/follow`);
      } catch (error) {
        console.error('Failed to follow designer:', error);
        // 对于示例项目，不恢复状态，保持本地更新
        // 因为示例项目的设计师可能不存在于后端数据库中
      }
    }
  };

  // 处理收藏
  const handleSave = async () => {
    // 先更新本地状态，确保 UI 立即响应
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);
    
    // 更新本地存储
    try {
      const savedProjects = JSON.parse(localStorage.getItem('savedProjects') || '[]');
      const updatedSaved = newIsSaved
        ? [...savedProjects, asset._id]
        : savedProjects.filter((id: string) => id !== asset._id);
      localStorage.setItem('savedProjects', JSON.stringify(updatedSaved));
    } catch (error) {
      console.error('Failed to update savedProjects in localStorage:', error);
    }
    
    // 然后调用 API 同步到后端
    if (isAuthenticated) {
      try {
        await api.post(`/projects/${asset._id}/save`);
      } catch (error) {
        console.error('Failed to save project:', error);
        // 对于示例项目，不恢复状态，保持本地更新
        // 因为示例项目可能不存在于后端数据库中
      }
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* 导航栏 */}
      <nav className="w-full z-40 bg-dark-bg/80 backdrop-blur-md border-b border-dark-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Logo size="md" />
          <div className="flex gap-6">
            <Link to="/examples">
              <button className="px-6 py-2 text-white hover:text-indigo-500 transition-colors">
                Back to Examples
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 主内容 */}
      <div className="max-w-6xl mx-auto p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 资产信息 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span 
                className="px-4 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: asset.assetType === 'image' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                  color: asset.assetType === 'image' ? '#34d399' : '#a78bfa',
                  border: `1px solid ${asset.assetType === 'image' ? '#34d399' : '#a78bfa'}`
                }}
              >
                {asset.assetType === 'image' ? 'Image' : 'Video'}
              </span>
              <span 
                className="px-4 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  color: '#a78bfa',
                  border: '1px solid #a78bfa'
                }}
              >
                {asset.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{asset.title}</h1>
            <p className="text-gray-400 mb-6">{asset.description}</p>
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <img 
                  src={asset.designer.avatar} 
                  alt={asset.designer.username}
                  className="w-10 h-10 rounded-full"
                  style={{ border: '2px solid #6366f1' }}
                />
                <span className="font-medium">{asset.designer.username}</span>
                <button
                  onClick={handleFollow}
                  className="ml-2 px-4 py-1 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: isFollowing ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)',
                    color: isFollowing ? '#ef4444' : '#a78bfa',
                    border: `1px solid ${isFollowing ? '#ef4444' : '#a78bfa'}`,
                  }}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
              <div className="flex items-center gap-6">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: isLiked ? 'rgba(239, 68, 68, 0.2)' : 'rgba(20, 20, 20, 0.8)',
                    color: isLiked ? '#ef4444' : '#9ca3af',
                    border: `1px solid ${isLiked ? '#ef4444' : '#262626'}`,
                  }}
                >
                  <svg className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {likes}
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: isSaved ? 'rgba(245, 158, 11, 0.2)' : 'rgba(20, 20, 20, 0.8)',
                    color: isSaved ? '#f59e0b' : '#9ca3af',
                    border: `1px solid ${isSaved ? '#f59e0b' : '#262626'}`,
                  }}
                >
                  <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  Save
                </button>
                <div className="flex items-center gap-1 text-gray-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {asset.views}
                </div>
              </div>
            </div>
          </div>

          {/* 资产展示 */}
          <div className="mb-12">
            <div 
              className="rounded-2xl overflow-hidden border border-dark-border"
              style={{ backgroundColor: '#141414' }}
            >
              {asset.assetType === 'image' ? (
                <img 
                  src={asset.assetUrl} 
                  alt={asset.title}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '600px' }}
                />
              ) : (
                <video 
                  src={asset.assetUrl} 
                  controls
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: '600px' }}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>

          {/* 相关资产 */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Assets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {cloudinaryAssets
                .filter(item => item._id !== asset._id && (item.category === asset.category || item.assetType === asset.assetType))
                .slice(0, 4)
                .map(relatedAsset => (
                  <Link 
                    key={relatedAsset._id} 
                    to={`/example/${relatedAsset._id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <div 
                      className="rounded-xl overflow-hidden border border-dark-border transition-transform duration-300 hover:scale-105"
                      style={{ backgroundColor: '#141414' }}
                    >
                      <img 
                        src={relatedAsset.coverImage} 
                        alt={relatedAsset.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-3">
                        <h3 className="font-medium text-white mb-1 line-clamp-1">{relatedAsset.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <span>{relatedAsset.assetType}</span>
                          <span>•</span>
                          <span>{relatedAsset.category}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              }
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
