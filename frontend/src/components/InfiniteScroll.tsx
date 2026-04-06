//无限滚动
import React, { useEffect, useRef } from 'react';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
  threshold?: number;
}

export default function InfiniteScroll({
  onLoadMore,
  hasMore,
  loading,
  children,
  threshold = 0.8,
}: InfiniteScrollProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading, onLoadMore, threshold]);

  return (
    <>
      {children}
      <div ref={loaderRef} className="h-20 flex items-center justify-center">
        {loading && (
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2" style={{ borderColor: '#6366f1' }} />
        )}
        {!hasMore && !loading && (
          <p className="text-sm" style={{ color: '#6b7280' }}>
            No more items to load
          </p>
        )}
      </div>
    </>
  );
}
