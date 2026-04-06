import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

interface Project {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  images: string[];
  category: string;
  tags: string[];
  designer: {
    _id: string;
    username: string;
    avatar: string;
  };
  likes: string[];
  views: number;
  createdAt: string;
}

interface UseProjectsOptions {
  category?: string;
  search?: string;
  designer?: string;
  limit?: number;
}

export function useProjects(options: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchProjects = useCallback(async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get('/projects', {
        params: {
          page: pageNum,
          limit: options.limit || 12,
          category: options.category,
          search: options.search,
          designer: options.designer,
        },
      });

      const { data, pagination } = response.data;

      if (reset) {
        setProjects(data);
      } else {
        setProjects(prev => [...prev, ...data]);
      }

      setTotal(pagination.total);
      setHasMore(pagination.hasNext);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [options.category, options.search, options.designer, options.limit]);

  // 初始加载
  useEffect(() => {
    setPage(1);
    fetchProjects(1, true);
  }, [options.category, options.search, options.designer]);

  // 加载更多
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProjects(nextPage);
    }
  };

  // 点赞
  const toggleLike = async (projectId: string) => {
    try {
      const response = await api.post(`/projects/${projectId}/like`);
      const { likes, isLiked } = response.data.data;

      setProjects(prev => prev.map(p => {
        if (p._id === projectId) {
          return { ...p, likes: Array(likes).fill('') };
        }
        return p;
      }));
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  return { projects, loading, error, hasMore, total, loadMore, toggleLike };
}
