import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import Logo from '../components/logo';
import api from '../utils/api';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useParams<{ token: string }>();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    console.log('开始重置密码...');
    console.log('Token:', token);
    console.log('密码长度:', formData.password.length);
    console.log('密码匹配:', formData.password === formData.confirmPassword);

    // 验证密码
    if (formData.password.length < 8) {
      setError('密码长度至少为 8 个字符');
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('密码和确认密码不匹配');
      setLoading(false);
      return;
    }

    try {
      if (!token) {
        setError('无效的重置链接');
        setLoading(false);
        return;
      }
      
      console.log('发送重置密码请求...');
      
      const response = await api.post('/auth/reset-password', {
        token: token,
        password: formData.password
      });
      
      console.log('重置密码响应:', response);
      
      setSuccess('密码重置成功！');
      // 3秒后跳转回登录页面
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('重置密码错误:', err);
      console.error('错误响应:', err.response);
      console.error('错误信息:', err.message);
      setError(err.response?.data?.message || '密码重置失败。请重试。');
    } finally {
      setLoading(false);
    }
  };

  // 检查 token 是否存在
  if (!token) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
        style={{ backgroundColor: '#0a0a0a', color: '#e5e5e5' }}
      >
        {/* 背景光晕装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 -left-40 w-96 h-96 rounded-full blur-3xl animate-pulse"
            style={{ backgroundColor: 'rgba(99,102,241,0.15)' }}
          />
          <div
            className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full blur-3xl animate-pulse"
            style={{ backgroundColor: 'rgba(168,85,247,0.15)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(99,102,241,0.08)' }}
          />
        </div>

        {/* 错误卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md relative z-10"
        >
          <div
            className="rounded-2xl p-8 backdrop-blur-xl"
            style={{
              backgroundColor: '#141414',
              border: '1px solid #262626',
              boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
            }}
          >
            {/* Logo */}
            <Link to="/" className="block text-center mb-8">
              <div className="flex justify-center">
                  <Logo size="md" animated={false} />
              </div>
            </Link>

            {/* 错误信息 */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#f87171' }}>Invalid Reset Link</h3>
              <p style={{ color: '#9ca3af' }}>The password reset link is invalid or has expired.</p>
              <p style={{ color: '#9ca3af', marginTop: '16px' }}>Please request a new password reset link.</p>
            </div>

            {/* 返回登录按钮 */}
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200"
                style={{
                  backgroundColor: '#6366f1',
                  cursor: 'pointer'
                }}
              >
                Back to Login
              </motion.button>
            </Link>
          </div>

          {/* 底部版权 */}
          <p className="text-center mt-6 text-xs" style={{ color: '#4b5563' }}>
            © 2025 PixelForge · All rights reserved
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundColor: '#0a0a0a', color: '#e5e5e5' }}
    >
      {/* 背景光晕装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 -left-40 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: 'rgba(99,102,241,0.15)' }}
        />
        <div
          className="absolute bottom-1/4 -right-40 w-96 h-96 rounded-full blur-3xl animate-pulse"
          style={{ backgroundColor: 'rgba(168,85,247,0.15)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(99,102,241,0.08)' }}
        />
      </div>

      {/* 重置密码卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md relative z-10"
      >
        <div
          className="rounded-2xl p-8 backdrop-blur-xl"
          style={{
            backgroundColor: '#141414',
            border: '1px solid #262626',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
          }}
        >
          {/* Logo */}
          <Link to="/" className="block text-center mb-8">
            <div className="flex justify-center">
                <Logo size="md" animated={false} />
            </div>
          </Link>

          {/* 标题 */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Reset Password</h3>
            <p style={{ color: '#9ca3af' }}>Enter your new password</p>
          </div>

          {/* 错误提示 */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-lg mb-6 text-sm"
              style={{
                backgroundColor: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.5)',
                color: '#f87171'
              }}
            >
              ⚠️ {error}
            </motion.div>
          )}

          {/* 成功提示 */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 rounded-lg mb-6 text-sm"
              style={{
                backgroundColor: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.5)',
                color: '#34d399'
              }}
            >
              ✅ {success}
            </motion.div>
          )}

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 新密码 */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
                New Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your new password"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #262626',
                  color: '#e5e5e5',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#262626'}
              />
            </div>

            {/* 确认密码 */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your new password"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #262626',
                  color: '#e5e5e5',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#262626'}
              />
            </div>

            {/* 重置按钮 */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200"
              style={{
                backgroundColor: loading ? '#4f46e5' : '#6366f1',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Resetting...
                </span>
              ) : (
                'Reset Password'
              )}
            </motion.button>
          </form>

          {/* 分割线 */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: '#262626' }} />
            <span className="text-xs" style={{ color: '#6b7280' }}>OR</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#262626' }} />
          </div>

          {/* 登录链接 */}
          <p className="text-center text-sm" style={{ color: '#9ca3af' }}>
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-medium transition-colors"
              style={{ color: '#6366f1' }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#818cf8')}
              onMouseOut={(e) => (e.currentTarget.style.color = '#6366f1')}
            >
              Sign in →
            </Link>
          </p>
        </div>

        {/* 底部版权 */}
        <p className="text-center mt-6 text-xs" style={{ color: '#4b5563' }}>
          © 2025 PixelForge · All rights reserved
        </p>
      </motion.div>
    </div>
  );
}