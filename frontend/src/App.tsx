import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// 页面组件
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import AuthCallback from './pages/AuthCallback';
import ProjectDetail from './pages/ProjectDetail';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import Examples from './pages/Examples';
import ExampleDetail from './pages/ExampleDetail';

// Dashboard 页面
import DashboardLayout from './components/DashboardLayout';
import Discover from './pages/Dashboard/Discover';
import UploadProject from './pages/Dashboard/UploadProject';
import MyProjects from './pages/Dashboard/MyProjects';
import LikedProjects from './pages/Dashboard/LikedProjects';
import SavedProjects from './pages/Dashboard/SavedProjects';
import Following from './pages/Dashboard/Following';
import Settings from './pages/Settings';

// 全局组件
import CustomClaudeCode from './components/CustomClaudeCode';
import LoadingSpinner from './components/LoadingSpinner';

/**
 * 路由守卫：需要登录才能访问
 */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

/**
 * 路由守卫：已登录用户不能访问（登录/注册页）
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

/**
 * 主路由配置
 */
function AppRoutes() {
  return (
    <>
      {/* 自定义鼠标（全局） */}
      <CustomClaudeCode />

      <Routes>
        {/* ========== 公开页面 ========== */}
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/profile/:username" element={<UserProfile />} />
        <Route path="/examples" element={<Examples />} />
        <Route path="/example/:id" element={<ExampleDetail />} />

        {/* OAuth 回调 */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* ========== 认证页面（未登录才能访问）========== */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />

        {/* ========== Dashboard（需要登录）========== */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* 默认页：发现 */}
          <Route index element={<Discover />} />

          {/* 上传项目 */}
          <Route path="upload" element={<UploadProject />} />

          {/* 我的项目 */}
          <Route path="my-projects" element={<MyProjects />} />

          {/* 喜欢的项目 */}
          <Route path="liked" element={<LikedProjects />} />

          {/* 收藏的项目 */}
          <Route path="saved" element={<SavedProjects />} />

          {/* 关注的人 */}
          <Route path="following" element={<Following />} />

          {/* 设置 */}
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ========== 404 页面 ========== */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

/**
 * 主应用组件
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
