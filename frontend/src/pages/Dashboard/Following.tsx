import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { UserAvatar, EmptyState, SkeletonLoader, Badge } from '../../components';

// 模拟的设计师数据，与示例页面中的数据匹配
const mockDesigners = [
  {
    _id: '1',
    username: 'Cloudinary',
    avatar: 'https://res.cloudinary.com/demo/image/upload/v1483486867/avatar.jpg',
    bio: 'Cloudinary is a cloud-based service that provides an end-to-end image and video management solution.',
    stats: {
      projects: 8,
      followers: 1000
    }
  }
];

export default function Following() {
  const { user } = useAuth();
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFollowing();
    }
  }, [user]);

  const fetchFollowing = async () => {
    try {
      // 尝试从后端获取关注列表
      const response = await api.get(`/users/${user?.id}/following`);
      const backendFollowing = response.data.data || [];
      
      // 从本地存储获取前端关注的设计师
      const frontendFollowing = JSON.parse(localStorage.getItem('followingDesigners') || '[]');
      
      // 合并后端和前端的关注列表
      const allFollowing = [...backendFollowing];
      
      // 添加前端关注的设计师（如果不在后端列表中）
      frontendFollowing.forEach((designerId: string) => {
        const mockDesigner = mockDesigners.find(d => d._id === designerId);
        if (mockDesigner && !allFollowing.find(f => f._id === designerId)) {
          allFollowing.push(mockDesigner);
        }
      });
      
      setFollowing(allFollowing);
    } catch (error) {
      console.error('Failed to fetch following:', error);
      // 错误时，从本地存储获取前端关注的设计师
      const frontendFollowing = JSON.parse(localStorage.getItem('followingDesigners') || '[]');
      const mockFollowing = mockDesigners.filter(d => frontendFollowing.includes(d._id));
      setFollowing(mockFollowing);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      // 尝试从后端取消关注
      await api.post(`/users/${userId}/follow`);
    } catch (error) {
      console.error('Failed to unfollow:', error);
    } finally {
      // 无论后端是否成功，都更新前端状态
      setFollowing(prev => prev.filter(u => u._id !== userId));
      
      // 更新本地存储
      const frontendFollowing = JSON.parse(localStorage.getItem('followingDesigners') || '[]');
      const updatedFollowing = frontendFollowing.filter((id: string) => id !== userId);
      localStorage.setItem('followingDesigners', JSON.stringify(updatedFollowing));
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-8">Following</h1>
        <div className="space-y-4">
          <SkeletonLoader type="avatar" count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Following</h1>
        <p style={{ color: '#6b7280' }}>
          {following.length} {following.length === 1 ? 'person' : 'people'} you follow
        </p>
      </div>

      {following.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Not following anyone yet"
          description="Discover talented designers and follow them to see their work"
          action={{
            label: 'Discover Designers',
            onClick: () => window.location.href = '/dashboard',
          }}
        />
      ) : (
        <div className="space-y-4">
          {following.map((followedUser, index) => (
            <motion.div
              key={followedUser._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl p-4 flex items-center justify-between"
              style={{ backgroundColor: '#141414', border: '1px solid #262626' }}
            >
              <div className="flex items-center gap-4 flex-1">
                <Link to={`/profile/${followedUser.username}`}>
                  <img
                    src={followedUser.avatar || `https://ui-avatars.com/api/?name=${followedUser.username}`}
                    alt={followedUser.username}
                    className="w-16 h-16 rounded-full object-cover"
                    style={{ border: '2px solid #6366f1' }}
                  />
                </Link>

                <div className="flex-1">
                  <Link to={`/profile/${followedUser.username}`}>
                    <h3 className="font-semibold text-lg hover:text-indigo-500 transition-colors">
                      {followedUser.username}
                    </h3>
                  </Link>
                  {followedUser.bio && (
                    <p className="text-sm mt-1 line-clamp-1" style={{ color: '#9ca3af' }}>
                      {followedUser.bio}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: '#6b7280' }}>
                    <span>{followedUser.stats?.projects || 0} projects</span>
                    <span>{followedUser.stats?.followers || 0} followers</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleUnfollow(followedUser._id)}
                className="px-6 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: '#141414',
                  border: '1px solid #6366f1',
                  color: '#6366f1',
                }}
              >
                Following
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
