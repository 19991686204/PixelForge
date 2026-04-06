// 骨架屏加载器组件
import React from 'react';

interface SkeletonLoaderProps {
  type?: 'card' | 'text' | 'avatar' | 'image';
  count?: number;
}

export default function SkeletonLoader({ type = 'card', count = 1 }: SkeletonLoaderProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#141414' }}>
            <div className="aspect-video animate-pulse" style={{ backgroundColor: '#1a1a1a' }} />
            <div className="p-4 space-y-3">
              <div className="h-4 rounded animate-pulse" style={{ backgroundColor: '#1a1a1a', width: '70%' }} />
              <div className="h-3 rounded animate-pulse" style={{ backgroundColor: '#1a1a1a', width: '40%' }} />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <div className="h-4 rounded animate-pulse" style={{ backgroundColor: '#1a1a1a' }} />
            <div className="h-4 rounded animate-pulse" style={{ backgroundColor: '#1a1a1a', width: '80%' }} />
            <div className="h-4 rounded animate-pulse" style={{ backgroundColor: '#1a1a1a', width: '60%' }} />
          </div>
        );

      case 'avatar':
        return (
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full animate-pulse" style={{ backgroundColor: '#1a1a1a' }} />
            <div className="flex-1 space-y-2">
              <div className="h-4 rounded animate-pulse" style={{ backgroundColor: '#1a1a1a', width: '40%' }} />
              <div className="h-3 rounded animate-pulse" style={{ backgroundColor: '#1a1a1a', width: '60%' }} />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="aspect-video rounded-xl animate-pulse" style={{ backgroundColor: '#1a1a1a' }} />
        );

      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
}
