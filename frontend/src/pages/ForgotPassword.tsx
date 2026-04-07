import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/logo';
import api from '../utils/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.post('/auth/forgot-password', {
        email: formData.email
      });
      setSuccess('Password reset link sent to your email!');
      // 3秒后跳转回登录页面
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

      {/* 忘记密码卡片 */}
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
            <h3 className="text-2xl font-bold mb-2">Forgot Password?</h3>
            <p style={{ color: '#9ca3af' }}>Enter your email to reset your password</p>
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
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#d1d5db' }}>
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
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
                  Sending...
                </span>
              ) : (
                'Send Reset Link'
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