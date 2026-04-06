// 通知组件
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = 'info',
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const styles = {
    success: { bg: 'rgba(34, 197, 94, 0.1)', border: '#22c55e', color: '#22c55e', icon: '✓' },
    error: { bg: 'rgba(239, 68, 68, 0.1)', border: '#ef4444', color: '#ef4444', icon: '✕' },
    warning: { bg: 'rgba(251, 191, 36, 0.1)', border: '#fbbf24', color: '#fbbf24', icon: '⚠' },
    info: { bg: 'rgba(99, 102, 241, 0.1)', border: '#6366f1', color: '#6366f1', icon: 'ℹ' },
  };

  const style = styles[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-6 left-1/2 z-[100] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]"
          style={{
            backgroundColor: style.bg,
            border: `1px solid ${style.border}`,
            color: style.color,
          }}
        >
          <span className="text-xl">{style.icon}</span>
          <p className="flex-1 font-medium">{message}</p>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full flex items-center justify-center transition-opacity hover:opacity-70"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
