// frontend/src/components/DashboardLayout.tsx
// Dashboard 布局组件

import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './logo';
import UserAvatar from './UserAvatar';

const navItems = [
  { path: '/dashboard', label: '发现', icon: '🔍' },
  { path: '/dashboard/upload', label: '上传项目', icon: '➕' },
  {
    label: '我的项目',
    icon: '📁',
    subItems: [
      { path: '/dashboard/my-projects?type=all', label: '全部' },
      { path: '/dashboard/my-projects?type=images', label: '图片' },
      { path: '/dashboard/my-projects?type=videos', label: '视频' },
    ],
  },
  {
    label: '点赞',
    icon: '❤️',
    subItems: [
      { path: '/dashboard/liked?type=all', label: '全部' },
      { path: '/dashboard/liked?type=images', label: '图片' },
      { path: '/dashboard/liked?type=videos', label: '视频' },
    ],
  },
  {
    label: '收藏',
    icon: '⭐',
    subItems: [
      { path: '/dashboard/saved?type=all', label: '全部' },
      { path: '/dashboard/saved?type=images', label: '图片' },
      { path: '/dashboard/saved?type=videos', label: '视频' },
    ],
  },
  { path: '/dashboard/following', label: '关注', icon: '👥' },
  { path: '/dashboard/settings', label: '设置', icon: '⚙️' },
];

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = (label: string) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-30
          w-64 bg-[#141414] border-r border-[#262626]
          flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-[#262626]">
          <Logo />
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            if (item.subItems) {
              return (
                <div key={item.label}>
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm transition-colors text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                    <span className={`transition-transform duration-300 ${expandedItem === item.label ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {expandedItem === item.label && (
                    <div className="ml-7 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <NavLink
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setSidebarOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg text-sm transition-colors ${
                              isActive
                                ? 'bg-[#6366f1]/20 text-[#6366f1] font-medium'
                                : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                            }`
                          }
                        >
                          {subItem.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            } else {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-[#6366f1]/20 text-[#6366f1] font-medium'
                        : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              );
            }
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-[#262626]">
          <div className="flex items-center gap-3 mb-3">
            <UserAvatar user={user} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          >
            退出登录
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#141414] border-b border-[#262626]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white"
            aria-label="打开菜单"
          >
            ☰
          </button>
          <Logo />
          <UserAvatar user={user} size="sm" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;