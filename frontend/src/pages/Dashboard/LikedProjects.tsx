import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { ProjectCard, EmptyState, SkeletonLoader } from '../../components';

// 模拟的项目数据，与示例页面中的数据匹配
const mockProjects = [
  {
    _id: '1',
    title: 'Mountain Landscape',
    coverImage: 'https://res.cloudinary.com/demo/image/upload/v1483486867/sample.jpg',
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

export default function LikedProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedProjects();
  }, []);

  const fetchLikedProjects = async () => {
    try {
      // 尝试从后端获取点赞的项目
      const userResponse = await api.get('/auth/me');
      const userId = userResponse.data.data._id;
      
      const response = await api.get('/projects');
      const backendProjects = response.data.data || [];
      
      // 过滤出用户点赞的项目
      const backendLikedProjects = backendProjects.filter((project: any) =>
        project.likes.includes(userId)
      );
      
      // 从本地存储获取前端点赞的项目
      const frontendLiked = JSON.parse(localStorage.getItem('likedProjects') || '[]');
      
      // 合并后端和前端的点赞项目
      const allLikedProjects = [...backendLikedProjects];
      
      // 添加前端点赞的项目（如果不在后端列表中）
      frontendLiked.forEach((projectId: string) => {
        const mockProject = mockProjects.find(p => p._id === projectId);
        if (mockProject && !allLikedProjects.find(p => p._id === projectId)) {
          allLikedProjects.push(mockProject);
        }
      });
      
      setProjects(allLikedProjects);
    } catch (error) {
      console.error('Failed to fetch liked projects:', error);
      // 错误时，从本地存储获取前端点赞的项目
      const frontendLiked = JSON.parse(localStorage.getItem('likedProjects') || '[]');
      const mockLikedProjects = mockProjects.filter(p => frontendLiked.includes(p._id));
      setProjects(mockLikedProjects);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (projectId: string) => {
    try {
      // 尝试从后端取消点赞
      await api.post(`/projects/${projectId}/like`);
    } catch (error) {
      console.error('Failed to unlike project:', error);
    } finally {
      // 无论后端是否成功，都更新前端状态
      setProjects(prev => prev.filter(p => p._id !== projectId));
      
      // 更新本地存储
      const frontendLiked = JSON.parse(localStorage.getItem('likedProjects') || '[]');
      const updatedLiked = frontendLiked.filter((id: string) => id !== projectId);
      localStorage.setItem('likedProjects', JSON.stringify(updatedLiked));
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-8">Liked Projects</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader type="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Liked Projects</h1>
        <p style={{ color: '#6b7280' }}>{projects.length} projects you liked</p>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon="❤️"
          title="No liked projects yet"
          description="Start exploring and like projects you love"
          action={{
            label: 'Discover Projects',
            onClick: () => window.location.href = '/dashboard',
          }}
        />
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="break-inside-avoid"
            >
              <ProjectCard
                project={project}
                onLike={() => handleUnlike(project._id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
