import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import api from '../../utils/api';
import { ProjectCard, EmptyState, SkeletonLoader } from '../../components';

// 导入示例资产数据
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

export default function SavedProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchSavedProjects();
  }, []);

  useEffect(() => {
    // 根据 URL 参数筛选项目
    const type = searchParams.get('type') || 'all';
    if (type === 'all') {
      setFilteredProjects(projects);
    } else if (type === 'images') {
      setFilteredProjects(projects.filter(project => 
        project.assetType === 'image' || 
        (project.images?.length > 0 && (!project.videos || project.videos.length === 0))
      ));
    } else if (type === 'videos') {
      setFilteredProjects(projects.filter(project => 
        project.assetType === 'video' || 
        (project.videos?.length > 0)
      ));
    }
  }, [projects, searchParams]);

  const fetchSavedProjects = async () => {
    try {
      // 从后端获取用户收藏的项目
      const response = await api.get('/projects/saved');
      let backendSavedProjects = response.data.data || [];
      
      // 去重处理
      const uniqueProjects = Array.from(new Map(backendSavedProjects.map((project: any) => [project._id, project])).values());
      
      console.log('Saved projects from backend (unique):', uniqueProjects);
      
      setProjects(uniqueProjects);
    } catch (error) {
      console.error('Failed to fetch saved projects from backend:', error);
      // 从本地存储获取数据作为备份
      try {
        const savedProjectIds = JSON.parse(localStorage.getItem('savedProjects') || '[]');
        // 去重处理
        const uniqueProjectIds = Array.from(new Set(savedProjectIds)) as string[];
        
        if (uniqueProjectIds.length > 0) {
          // 尝试为每个本地存储的项目ID获取项目详情
          const fetchProjectPromises = uniqueProjectIds.map(async (projectId: string) => {
            try {
              // 尝试从后端获取项目详情
              const response = await api.get(`/projects/${projectId}`);
              return response.data.data;
            } catch (projectError) {
              console.error(`Failed to fetch project ${projectId}:`, projectError);
              // 如果后端获取失败，从示例数据中查找
              return cloudinaryAssets.find(asset => asset._id === projectId) || null;
            }
          });
          
          const fetchedProjects = await Promise.all(fetchProjectPromises);
          // 过滤掉null值并去重
          const savedProjects = Array.from(new Map(fetchedProjects.filter((project): project is any => project !== null).map((project: any) => [project._id, project])).values());
          console.log('Saved projects from local storage and API (unique):', savedProjects);
          setProjects(savedProjects);
        } else {
          setProjects([]);
        }
      } catch (localError) {
        console.error('Failed to load saved projects from local storage:', localError);
        setProjects([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (projectId: string) => {
    try {
      // 从后端取消收藏
      await api.post(`/projects/${projectId}/save`);
      // 重新获取收藏列表，确保数据实时更新
      await fetchSavedProjects();
    } catch (error) {
      console.error('Failed to unsave project:', error);
      // 即使失败，也从列表中移除该项目，保持UI一致性
      setProjects(prev => prev.filter(p => p._id !== projectId));
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-8">Saved Projects</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonLoader type="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Saved Projects</h1>
        <p style={{ color: '#6b7280' }}>{filteredProjects.length} projects you saved</p>
      </div>

      {filteredProjects.length === 0 ? (
        <EmptyState
          icon="⭐"
          title="No saved projects yet"
          description="Start exploring and save projects you love"
          action={{
            label: 'Discover Projects',
            onClick: () => window.location.href = '/dashboard',
          }}
        />
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="break-inside-avoid"
            >
              <ProjectCard
                project={project}
                onSave={() => handleUnsave(project._id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}