// 404 页面组件
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#0a0a0a', color: '#e5e5e5' }}>
      <div className="text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-8xl font-black mb-4"
          style={{ color: '#6366f1' }}
        >
          404
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-4"
        >
          Page Not Found
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
          style={{ color: '#6b7280' }}
        >
          The page you're looking for doesn't exist.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/">
            <button
              className="px-8 py-3 rounded-xl font-semibold text-white"
              style={{ backgroundColor: '#6366f1' }}
            >
              Back to Home
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
