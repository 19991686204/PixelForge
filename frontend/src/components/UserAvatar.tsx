// 用户头像组件
import React from 'react';
import { Link } from 'react-router-dom';

interface UserAvatarProps {
  user: { username: string; avatar?: string; } | null | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  clickable?: boolean;
}

export default function UserAvatar({
  user,
  size = 'md',
  showName = false,
  clickable = true,
}: UserAvatarProps) {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  // 如果 user 为 null 或 undefined，返回默认头像
  if (!user) {
    const avatar = (
      <div className="flex items-center gap-2">
        <img
          src={`https://ui-avatars.com/api/?name=Guest&background=6366f1&color=fff`}
          alt="Guest"
          className={`${sizes[size]} rounded-full object-cover`}
          style={{ border: '2px solid #6366f1' }}
        />
        {showName && (
          <span className={`${textSizes[size]} font-medium`}>
            Guest
          </span>
        )}
      </div>
    );

    if (clickable) {
      return (
        <Link to="/login" className="hover:opacity-80 transition-opacity">
          {avatar}
        </Link>
      );
    }

    return avatar;
  }

  const avatar = (
    <div className="flex items-center gap-2">
      <img
        src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff`}
        alt={user.username}
        className={`${sizes[size]} rounded-full object-cover`}
        style={{ border: '2px solid #6366f1' }}
      />
      {showName && (
        <span className={`${textSizes[size]} font-medium`}>
          {user.username}
        </span>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link to={`/profile/${user.username}`} className="hover:opacity-80 transition-opacity">
        {avatar}
      </Link>
    );
  }

  return avatar;
}
