// 认证回调页面组件
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Logging you in...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 从 URL 获取 token
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        // 如果有错误参数
        if (error) {
          setStatus('error');
          setMessage('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // 如果没有 token
        if (!token) {
          setStatus('error');
          setMessage('No authentication token found.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // 保存 token
        localStorage.setItem('token', token);

        // 获取用户信息
        const response = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data.data;
        localStorage.setItem('user', JSON.stringify(user));

        // 成功
        setStatus('success');
        setMessage(`Welcome back, ${user.username}!`);

        // 跳转到 dashboard
        setTimeout(() => navigate('/dashboard'), 1500);
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage('Authentication failed. Please try again.');

        // 清除可能的错误 token
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#0a0a0a', color: '#e5e5e5' }}
    >
      {/* 背景光晕 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center relative z-10"
      >
        {/* 状态图标 */}
        <div className="mb-6 flex justify-center">
          {status === 'loading' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 rounded-full border-4 border-t-transparent"
              style={{ borderColor: '#6366f1', borderTopColor: 'transparent' }}
            />
          )}

          {status === 'success' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', border: '2px solid #22c55e' }}
            >
              <svg className="w-8 h-8" style={{ color: '#22c55e' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '2px solid #ef4444' }}
            >
              <svg className="w-8 h-8" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.div>
          )}
        </div>

        {/* Logo */}
        <div className="mb-4">
          <span className="text-2xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span style={{ color: '#6366f1' }}>Pixel</span>
            <span style={{ color: '#ffffff' }}>Forge</span>
          </span>
        </div>

        {/* 状态文字 */}
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-lg font-medium mb-2"
          style={{
            color: status === 'success'
              ? '#22c55e'
              : status === 'error'
                ? '#ef4444'
                : '#e5e5e5',
          }}
        >
          {message}
        </motion.p>

        {status === 'error' && (
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Redirecting to login page...
          </p>
        )}

        {status === 'success' && (
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Redirecting to dashboard...
          </p>
        )}

        {/* 进度条 */}
        {status !== 'loading' && (
          <motion.div
            className="mt-6 h-1 rounded-full overflow-hidden mx-auto"
            style={{ width: '200px', backgroundColor: '#262626' }}
          >
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: status === 'success' ? 1.5 : 3 }}
              className="h-full rounded-full"
              style={{ backgroundColor: status === 'success' ? '#22c55e' : '#ef4444' }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
