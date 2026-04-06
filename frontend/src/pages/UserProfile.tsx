import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import Logo from '../components/logo';

export default function UserProfile() {
  const { username } = useParams();
  const { user: currentUser, isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${username}`);
      const { user, projects, isFollowing } = response.data.data;
      setProfileData({ user, projects });
      setIsFollowing(isFollowing);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) return;
    setFollowLoading(true);
    try {
      const response = await api.post(`/users/${profileData.user._id}/follow`);
      setIsFollowing(response.data.data.isFollowing);

      // 更新粉丝数
      setProfileData((prev: any) => ({
        ...prev,
        user: {
          ...prev.user,
          stats: {
            ...prev.user.stats,
            followers: prev.user.stats.followers + (response.data.data.isFollowing ? 1 : -1),
          },
        },
      }));
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0a0a0a' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: '#0a0a0a' }}>
        <p style={{ color: '#6b7280' }}>User not found</p>
      </div>
    );
  }

  const { user, projects } = profileData;
  const isOwnProfile = currentUser?.username === username;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#e5e5e5' }}>
      {/* 顶部导航 */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl"
        style={{ backgroundColor: 'rgba(10,10,10,0.8)', borderBottom: '1px solid #262626' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" />
          </Link>
          {isAuthenticated && (
            <Link to="/dashboard">
              <button className="px-4 py-2 rounded-lg text-sm"
                style={{ backgroundColor: '#141414', border: '1px solid #262626' }}>
                ← Back to Feed
              </button>
            </Link>
          )}
        </div>
      </nav>

      <div className="pt-16">
        {/* 封面图 */}
        <div className="h-48 sm:h-64 relative"
          style={{ backgroundColor: '#141414' }}>
          {user.coverImage && (
            <img src={user.coverImage} alt="Cover"
              className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,0.8))' }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* 用户信息区域 */}
          <div className="relative -mt-16 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              {/* 头像 */}
              <div className="flex items-end gap-4">
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`}
                  alt={user.username}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover"
                  style={{ border: '4px solid #6366f1' }}
                />
                <div className="mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold">
                    {user.displayName || user.username}
                  </h1>
                  <p style={{ color: '#9ca3af' }}>@{user.username}</p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3">
                {isOwnProfile ? (
                  <Link to="/dashboard/settings">
                    <button
                      className="px-6 py-2.5 rounded-xl font-medium transition-all"
                      style={{ backgroundColor: '#141414', border: '1px solid #262626' }}
                    >
                      Edit Profile
                    </button>
                  </Link>
                ) : isAuthenticated ? (
                  <button
                    onClick={handleFollow}
                    disabled={followLoading}
                    className="px-6 py-2.5 rounded-xl font-medium text-white transition-all"
                    style={{
                      backgroundColor: isFollowing ? '#141414' : '#6366f1',
                      border: isFollowing ? '1px solid #6366f1' : 'none',
                      color: isFollowing ? '#6366f1' : '#ffffff',
                    }}
                  >
                    {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                  </button>
                ) : null}
              </div>
            </div>

            {/* 简介 */}
            {user.bio && (
              <p className="mt-4 max-w-2xl" style={{ color: '#d1d5db' }}>{user.bio}</p>
            )}

            {/* 位置和网站 */}
            <div className="flex flex-wrap gap-4 mt-3">
              {user.location && (
                <span className="flex items-center gap-1 text-sm" style={{ color: '#9ca3af' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {user.location}
                </span>
              )}
              {user.website && (
                <a href={user.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm transition-colors"
                  style={{ color: '#6366f1' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {user.website}
                </a>
              )}
            </div>

            {/* 技能标签 */}
            {user.skills && user.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {user.skills.map((skill: string, i: number) => (
                  <span key={i}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: '#1a1a1a', color: '#a78bfa', border: '1px solid #2a2a2a' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* 统计数据 */}
            <div className="grid grid-cols-4 gap-4 mt-6 max-w-sm">
              {[
                { label: 'Projects', value: user.stats?.projects || 0 },
                { label: 'Followers', value: user.stats?.followers || 0 },
                { label: 'Following', value: user.stats?.following || 0 },
                { label: 'Likes', value: user.stats?.likes || 0 },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-bold" style={{ color: '#6366f1' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs mt-1" style={{ color: '#6b7280' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 标签页 */}
          <div className="flex gap-6 mb-8"
            style={{ borderBottom: '1px solid #262626' }}>
            {['projects', 'about'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="pb-3 text-sm font-medium capitalize transition-colors"
                style={{
                  color: activeTab === tab ? '#6366f1' : '#6b7280',
                  borderBottom: activeTab === tab ? '2px solid #6366f1' : '2px solid transparent',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 项目网格 */}
          {activeTab === 'projects' && (
            <div className="pb-12">
              {projects.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl font-semibold mb-2">No projects yet</p>
                  <p style={{ color: '#6b7280' }}>
                    {isOwnProfile ? 'Upload your first project!' : 'This user has no projects yet.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project: any, index: number) => (
                    <motion.div
                      key={project._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 关于页面 */}
          {activeTab === 'about' && (
            <div className="pb-12 max-w-2xl">
              <div className="rounded-xl p-6"
                style={{ backgroundColor: '#141414', border: '1px solid #262626' }}>
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <p style={{ color: '#d1d5db', lineHeight: '1.8' }}>
                  {user.bio || 'No bio provided.'}
                </p>

                {/* 社交链接 */}
                {user.social && Object.keys(user.social).some(k => user.social[k]) && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-3" style={{ color: '#9ca3af' }}>
                      Social Links
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {user.social.behance && (
                        <a href={user.social.behance} target="_blank" rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg text-sm transition-colors"
                          style={{ backgroundColor: '#1a1a1a', color: '#6366f1', border: '1px solid #2a2a2a' }}>
                          Behance
                        </a>
                      )}
                      {user.social.dribbble && (
                        <a href={user.social.dribbble} target="_blank" rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg text-sm transition-colors"
                          style={{ backgroundColor: '#1a1a1a', color: '#6366f1', border: '1px solid #2a2a2a' }}>
                          Dribbble
                        </a>
                      )}
                      {user.social.linkedin && (
                        <a href={user.social.linkedin} target="_blank" rel="noopener noreferrer"
                          className="px-4 py-2 rounded-lg text-sm transition-colors"
                          style={{ backgroundColor: '#1a1a1a', color: '#6366f1', border: '1px solid #2a2a2a' }}>
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
