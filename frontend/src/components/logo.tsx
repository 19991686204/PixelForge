// 自定义Logo组件
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function Logo({ size = 'md', animated = true }: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 32, text: 'text-xl' },
    md: { width: 48, height: 48, text: 'text-2xl' },
    lg: { width: 64, height: 64, text: 'text-4xl' }
  };

  const { width, height, text } = sizes[size];

  return (
    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="flex items-center gap-3 cursor-pointer">
      {/* SVG Logo 图标 */}
      <motion.div
        initial={animated ? { rotate: 0, scale: 0.8 } : {}}
        animate={animated ? { rotate: 360, scale: 1 } : {}}
        transition={animated ? { duration: 1, ease: 'easeOut' } : {}}
        whileHover={animated ? { scale: 1.1, rotate: 10 } : {}}
      >
        <svg
          width={width}
          height={height}
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 外圈六边形（像素风格） */}
          <motion.path
            d="M32 4L52 16V40L32 52L12 40V16L32 4Z"
            stroke="url(#gradient1)"
            strokeWidth="2.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />

          {/* 内部锤子图标（锻造主题） */}
          <g transform="translate(20, 18)">
            {/* 锤头 */}
            <motion.rect
              x="8"
              y="2"
              width="12"
              height="8"
              rx="1"
              fill="#6366f1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
            />
            {/* 锤柄 */}
            <motion.rect
              x="13"
              y="8"
              width="2"
              height="16"
              rx="1"
              fill="url(#gradient2)"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 150 }}
            />
            {/* 火花效果 */}
            <motion.circle
              cx="14"
              cy="6"
              r="1.5"
              fill="#fbbf24"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{ delay: 1, duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
            />
            <motion.circle
              cx="18"
              cy="4"
              r="1"
              fill="#fbbf24"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
              transition={{ delay: 1.2, duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            />
          </g>

          {/* 像素点装饰 */}
          <motion.rect
            x="28"
            y="54"
            width="3"
            height="3"
            fill="#a78bfa"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 1.5, duration: 1, repeat: Infinity, repeatDelay: 1 }}
          />
          <motion.rect
            x="33"
            y="54"
            width="3"
            height="3"
            fill="#818cf8"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 1.7, duration: 1, repeat: Infinity, repeatDelay: 1 }}
          />

          {/* 渐变定义 */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 文字 Logo */}
      <div className={`font-display font-black tracking-tight ${text}`}>
        <motion.span
          className="inline-block"
          style={{ color: '#6366f1' }}
          initial={animated ? { opacity: 0, x: -10 } : {}}
          animate={animated ? { opacity: 1, x: 0 } : {}}
          transition={animated ? { delay: 0.3 } : {}}
        >
          Pixel
        </motion.span>
        <motion.span
          className="inline-block"
          style={{ color: '#ffffff' }}
          initial={animated ? { opacity: 0, x: -10 } : {}}
          animate={animated ? { opacity: 1, x: 0 } : {}}
          transition={animated ? { delay: 0.5 } : {}}
        >
          Forge
        </motion.span>
      </div>
    </div>
    </Link>
  );
}
