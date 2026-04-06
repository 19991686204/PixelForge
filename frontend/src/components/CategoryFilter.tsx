//分类筛选
import React from 'react';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all"
          style={{
            backgroundColor: activeCategory === category ? '#6366f1' : '#141414',
            color: activeCategory === category ? '#ffffff' : '#9ca3af',
            border: '1px solid',
            borderColor: activeCategory === category ? '#6366f1' : '#262626',
          }}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
}
