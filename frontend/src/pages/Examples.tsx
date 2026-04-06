// 示例页面实现
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const cloudinarySamples = [
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
    category: 'Photography'
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
    category: 'Still Life'
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
    category: 'Portrait'
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
    category: 'Nature'
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
    category: 'Nature'
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
    category: 'Corporate'
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
    category: 'Nature'
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
    category: 'Urban'
  }
];

export default function Examples() {
  const { user, isAuthenticated } = useAuth();
  
  // 状态管理：跟踪点赞和收藏状态
  // 从本地存储加载状态
  const [likedProjects, setLikedProjects] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('likedProjects') || '[]');
    } catch (error) {
      console.error('Failed to load likedProjects from localStorage:', error);
      return [];
    }
  });
  const [savedProjects, setSavedProjects] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('savedProjects') || '[]');
    } catch (error) {
      console.error('Failed to load savedProjects from localStorage:', error);
      return [];
    }
  });
  const [followingDesigners, setFollowingDesigners] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('followingDesigners') || '[]');
    } catch (error) {
      console.error('Failed to load followingDesigners from localStorage:', error);
      return [];
    }
  });

  // 处理点赞
  const handleLike = async (projectId: string) => {
    // 先更新本地状态，确保 UI 立即响应
    setLikedProjects(prev => {
      const updated = prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId];
      // 更新本地存储
      localStorage.setItem('likedProjects', JSON.stringify(updated));
      return updated;
    });
    
    // 然后调用 API 同步到后端
    if (isAuthenticated) {
      try {
        await api.post(`/projects/${projectId}/like`);
      } catch (error) {
        console.error('Failed to like project:', error);
        // 对于示例项目，不恢复状态，保持本地更新
        // 因为示例项目可能不存在于后端数据库中
      }
    }
  };

  // 处理关注
  const handleFollow = async (designerId: string) => {
    // 先更新本地状态，确保 UI 立即响应
    setFollowingDesigners(prev => {
      const updated = prev.includes(designerId)
        ? prev.filter(id => id !== designerId)
        : [...prev, designerId];
      // 更新本地存储
      localStorage.setItem('followingDesigners', JSON.stringify(updated));
      return updated;
    });
    
    // 然后调用 API 同步到后端
    if (isAuthenticated) {
      try {
        await api.post(`/users/${designerId}/follow`);
      } catch (error) {
        console.error('Failed to follow designer:', error);
        // 对于示例项目，不恢复状态，保持本地更新
        // 因为示例项目的设计师可能不存在于后端数据库中
      }
    }
  };

  // 处理收藏
  const handleSave = async (projectId: string) => {
    // 先更新本地状态，确保 UI 立即响应
    setSavedProjects(prev => {
      const updated = prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId];
      // 更新本地存储
      localStorage.setItem('savedProjects', JSON.stringify(updated));
      return updated;
    });
    
    // 然后调用 API 同步到后端
    if (isAuthenticated) {
      try {
        await api.post(`/projects/${projectId}/save`);
      } catch (error) {
        console.error('Failed to save project:', error);
        // 对于示例项目，不恢复状态，保持本地更新
        // 因为示例项目可能不存在于后端数据库中
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Example Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cloudinarySamples.map(project => (
          <ProjectCard 
            key={project._id} 
            project={project} 
            clickable={true} 
            linkTo={`/example/${project._id}`} 
            onLike={() => handleLike(project._id)}
            onFollow={() => handleFollow(project.designer._id)}
            onSave={() => handleSave(project._id)}
            isFollowing={followingDesigners.includes(project.designer._id)}
            isSaved={savedProjects.includes(project._id)}
            isLiked={likedProjects.includes(project._id)}
          />
        ))}
      </div>
    </div>
  );
}