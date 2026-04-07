// 自定义ClaudeCode组件
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomClaudeCode(): React.JSX.Element {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // 强制隐藏系统鼠标
    const hideSystemCursor = () => {
      document.body.style.cursor = 'none';
      document.documentElement.style.cursor = 'none';
      // 防止输入框等元素恢复默认鼠标
      const interactiveElements = document.querySelectorAll('input, textarea, select, button, a, div, span');
      interactiveElements.forEach(el => {
        (el as HTMLElement).style.cursor = 'none';
      });
    };

    // 立即隐藏系统鼠标
    hideSystemCursor();

    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      // 持续检查并隐藏系统鼠标
      hideSystemCursor();
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const tag = target.tagName.toLowerCase();
      
      // 在以下元素上显示悬停效果
      if (
        tag === 'a' || 
        tag === 'button' || 
        tag === 'input' || 
        tag === 'textarea' ||
        tag === 'select' ||
        target.style.cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
      
      // 确保鼠标保持隐藏
      hideSystemCursor();
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    // 监听焦点事件，防止输入框恢复鼠标
    const handleFocus = () => {
      hideSystemCursor();
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('focus', handleFocus, true);
    document.addEventListener('click', hideSystemCursor);

    return () => {
      // 恢复系统鼠标
      document.body.style.cursor = 'auto';
      document.documentElement.style.cursor = 'auto';
      const interactiveElements = document.querySelectorAll('input, textarea, select, button, a, div, span');
      interactiveElements.forEach(el => {
        (el as HTMLElement).style.cursor = '';
      });
      
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('focus', handleFocus, true);
      document.removeEventListener('click', hideSystemCursor);
    };
  }, []);

  return (
    <>
      {/* 主光标 */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[60] mix-blend-difference"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
        }}
      >
        <div className="w-full h-full border-2 border-indigo-500 rounded-full" />
      </motion.div>

      {/* 跟随点 */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-indigo-500 rounded-full pointer-events-none z-[60] mix-blend-difference"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: 'spring',
          stiffness: 1000,
          damping: 50,
        }}
      />
    </>
  );
}
