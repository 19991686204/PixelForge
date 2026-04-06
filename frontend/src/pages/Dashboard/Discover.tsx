// 发现页面组件
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../../components/ProjectCard';
import { useProjects } from '../../hooks/useProjects';

const CATEGORIES = [
  'all', 'UI/UX', 'Graphic Design',
  'Illustration', '3D', 'Motion Graphics',
  'Branding', 'Photography', 'Web Design',
];

export default function Discover() {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const loaderRef = useRef<HTMLDivElement>(null);

  const { projects, loading, hasMore, loadMore, toggleLike } = useProjects({
    category: category || undefined,
    search: search || undefined,
  });

  // 搜索防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 无限滚动
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, loadMore]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* 搜索栏 */}
      <div className="mb-6">
        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-xl outline-none transition-all"
            style={{
              backgroundColor: '#141414',
              border: '1px solid #262626',
              color: '#e5e5e5',
            }}
            onFocus={(e) => e.target.style.borderColor = '#6366f1'}
            onBlur={(e) => e.target.style.borderColor = '#262626'}
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: '#6b7280' }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 分类过滤 */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat === 'all' ? '' : cat)}
            className="px-5 py-2 rounded-full text-sm whitespace-nowrap transition-all"
            style={{
              backgroundColor: (cat === 'all' ? !category : category === cat)
                ? '#6366f1' : '#141414',
              color: (cat === 'all' ? !category : category === cat)
                ? '#ffffff' : '#9ca3af',
              border: '1px solid',
              borderColor: (cat === 'all' ? !category : category === cat)
                ? '#6366f1' : '#262626',
            }}
          >
            {cat === 'all' ? 'All Projects' : cat}
          </button>
        ))}
      </div>

      {/* 项目网格 */}
      {projects.length === 0 && !loading ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎨</div>
          <p className="text-xl font-semibold mb-2">No projects found</p>
          <p style={{ color: '#6b7280' }}>Try a different search or category</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          {projects.map((project: any, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="break-inside-avoid"
            >
              <ProjectCard
                project={project}
                onLike={() => toggleLike(project._id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* 加载骨架屏 */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl animate-pulse"
              style={{
                height: `${200 + Math.random() * 150}px`,
                backgroundColor: '#141414',
              }}
            />
          ))}
        </div>
      )}

      {/* 无限滚动触发器 */}
      <div ref={loaderRef} className="h-10" />

      {/* 没有更多数据提示 */}
      {!hasMore && projects.length > 0 && (
        <p className="text-center py-8" style={{ color: '#6b7280' }}>
          You've seen all projects ✨
        </p>
      )}
    </div>
  );
}
