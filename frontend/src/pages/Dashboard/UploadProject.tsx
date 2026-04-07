import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { ImageUploader, Badge } from '../../components';

const CATEGORIES = [
  'UI/UX', 'Graphic Design', 'Illustration',
  '3D', 'Motion Graphics', 'Branding',
  'Photography', 'Web Design', 'Product Design', 'Typography',
];

const POPULAR_TOOLS = [
  'Figma', 'Adobe XD', 'Sketch', 'Photoshop',
  'Illustrator', 'After Effects', 'Blender',
  'Cinema 4D', 'Procreate', 'InVision',
];

export default function UploadProject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    tools: [] as string[],
    projectUrl: '',
    client: '',
  });

  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<any>({});
  const [customTool, setCustomTool] = useState('');

  // 表单验证
  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (images.length === 0 && videos.length === 0) {
      newErrors.files = 'At least one image or video is required';
    }

    if (formData.projectUrl && !/^https?:\/\/.+/.test(formData.projectUrl)) {
      newErrors.projectUrl = 'Please enter a valid URL (starting with http:// or https://)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 切换工具选择
  const toggleTool = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool],
    }));
  };

  // 添加自定义工具
  const addCustomTool = () => {
    if (customTool.trim() && !formData.tools.includes(customTool.trim())) {
      setFormData(prev => ({
        ...prev,
        tools: [...prev.tools, customTool.trim()],
      }));
      setCustomTool('');
    }
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('description', formData.description.trim());
      data.append('category', formData.category);
      data.append('tags', JSON.stringify(
        formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      ));
      data.append('tools', JSON.stringify(formData.tools));

      if (formData.projectUrl) {
        data.append('projectUrl', formData.projectUrl);
      }
      if (formData.client) {
        data.append('client', formData.client);
      }

      console.log('Uploading images:', images.length, 'videos:', videos.length);
      
      images.forEach(image => {
        data.append('files', image);
      });
      
      videos.forEach(video => {
        data.append('files', video);
      });

      await api.post('/projects', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      navigate('/dashboard/my-projects');
    } catch (error: any) {
      console.error('Upload failed:', error);
      setErrors({
        submit: error.response?.data?.message || 'Upload failed. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-1">Upload New Project</h1>
        <p style={{ color: '#6b7280' }}>Share your creative work with the community</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 图片和视频上传 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: '#141414', border: '1px solid #262626' }}
        >
          <h2 className="text-xl font-semibold mb-2">Project Media</h2>
          <p className="text-sm mb-6" style={{ color: '#6b7280' }}>
            Upload up to 20 images or 5 videos. Max file size: 10MB each. The first image will be used as the cover.
          </p>
          
          {/* 图片上传 */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3" style={{ color: '#d1d5db' }}>Images</h3>
            <ImageUploader
              onImagesChange={setImages}
              maxFiles={20}
              maxSizeMB={10}
            />
          </div>
          
          {/* 视频上传 */}
          <div>
            <h3 className="text-sm font-medium mb-3" style={{ color: '#d1d5db' }}>Videos</h3>
            <ImageUploader
              onImagesChange={setVideos}
              maxFiles={5}
              maxSizeMB={10}
              allowVideos={true}
            />
          </div>
          
          {(errors.images || errors.videos || errors.files) && (
            <p className="text-sm mt-2" style={{ color: '#ef4444' }}>
              {errors.files || errors.images || errors.videos}
            </p>
          )}
        </motion.div>

        {/* 基本信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: '#141414', border: '1px solid #262626' }}
        >
          <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

          <div className="space-y-5">
            {/* 标题 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Mobile Banking App Redesign"
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: `1px solid ${errors.title ? '#ef4444' : '#262626'}`,
                  color: '#e5e5e5',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = errors.title ? '#ef4444' : '#262626')}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.title ? (
                  <p className="text-xs" style={{ color: '#ef4444' }}>{errors.title}</p>
                ) : (
                  <span />
                )}
                <span className="text-xs" style={{ color: '#6b7280' }}>
                  {formData.title.length}/100
                </span>
              </div>
            </div>

            {/* 描述 */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your project, the problem it solves, your design process..."
                rows={6}
                maxLength={2000}
                className="w-full px-4 py-3 rounded-xl outline-none resize-none transition-all"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: `1px solid ${errors.description ? '#ef4444' : '#262626'}`,
                  color: '#e5e5e5',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = errors.description ? '#ef4444' : '#262626')}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.description ? (
                  <p className="text-xs" style={{ color: '#ef4444' }}>{errors.description}</p>
                ) : (
                  <span />
                )}
                <span className="text-xs" style={{ color: '#6b7280' }}>
                  {formData.description.length}/2000
                </span>
              </div>
            </div>

            {/* 分类 */}
            <div>
              <label className="block text-sm font-medium mb-3">
                Category <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: formData.category === cat ? '#6366f1' : '#1a1a1a',
                      color: formData.category === cat ? '#ffffff' : '#9ca3af',
                      border: `1px solid ${formData.category === cat ? '#6366f1' : '#262626'}`,
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-xs mt-2" style={{ color: '#ef4444' }}>{errors.category}</p>
              )}
            </div>

            {/* 标签 */}
            <div>
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="mobile, ui, fintech, dark-mode (comma separated, max 10)"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #262626',
                  color: '#e5e5e5',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#262626')}
              />
              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                Separate tags with commas. Max 10 tags.
              </p>

              {/* 标签预览 */}
              {formData.tags && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.tags.split(',').map((tag, i) => (
                    tag.trim() && (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs"
                        style={{ backgroundColor: '#1a1a1a', color: '#9ca3af', border: '1px solid #262626' }}
                      >
                        #{tag.trim()}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 工具选择 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: '#141414', border: '1px solid #262626' }}
        >
          <h2 className="text-xl font-semibold mb-2">Tools Used</h2>
          <p className="text-sm mb-5" style={{ color: '#6b7280' }}>
            Select the tools you used for this project
          </p>

          {/* 常用工具 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {POPULAR_TOOLS.map(tool => (
              <button
                key={tool}
                type="button"
                onClick={() => toggleTool(tool)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: formData.tools.includes(tool)
                    ? 'rgba(99, 102, 241, 0.2)' : '#1a1a1a',
                  color: formData.tools.includes(tool) ? '#a78bfa' : '#9ca3af',
                  border: `1px solid ${formData.tools.includes(tool) ? '#6366f1' : '#262626'}`,
                }}
              >
                {formData.tools.includes(tool) ? '✓ ' : ''}{tool}
              </button>
            ))}
          </div>

          {/* 自定义工具输入 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customTool}
              onChange={(e) => setCustomTool(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomTool();
                }
              }}
              placeholder="Add custom tool..."
              className="flex-1 px-4 py-2.5 rounded-lg outline-none transition-all text-sm"
              style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #262626',
                color: '#e5e5e5',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
              onBlur={(e) => (e.target.style.borderColor = '#262626')}
            />
            <button
              type="button"
              onClick={addCustomTool}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ backgroundColor: '#6366f1', color: '#ffffff' }}
            >
              Add
            </button>
          </div>

          {/* 已选工具展示 */}
          {formData.tools.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {formData.tools.map(tool => (
                <Badge key={tool} variant="info">
                  {tool}
                  <button
                    type="button"
                    onClick={() => toggleTool(tool)}
                    className="ml-2 hover:opacity-70"
                  >
                    ✕
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </motion.div>

        {/* 附加信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: '#141414', border: '1px solid #262626' }}
        >
          <h2 className="text-xl font-semibold mb-6">Additional Information</h2>

          <div className="space-y-5">
            {/* 项目链接 */}
            <div>
              <label className="block text-sm font-medium mb-2">Live Project URL</label>
              <input
                type="url"
                value={formData.projectUrl}
                onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                placeholder="https://your-project.com"
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: `1px solid ${errors.projectUrl ? '#ef4444' : '#262626'}`,
                  color: '#e5e5e5',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = errors.projectUrl ? '#ef4444' : '#262626')}
              />
              {errors.projectUrl && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.projectUrl}</p>
              )}
            </div>

            {/* 客户名称 */}
            <div>
              <label className="block text-sm font-medium mb-2">Client Name (Optional)</label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                placeholder="e.g. Acme Corporation"
                maxLength={100}
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #262626',
                  color: '#e5e5e5',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e) => (e.target.style.borderColor = '#262626')}
              />
            </div>
          </div>
        </motion.div>

        {/* 上传进度条 */}
        {uploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-xl p-4"
            style={{ backgroundColor: '#141414', border: '1px solid #262626' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Uploading...</span>
              <span className="text-sm" style={{ color: '#6366f1' }}>{uploadProgress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#262626' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: '#6366f1' }}
              />
            </div>
          </motion.div>
        )}

        {/* 错误提示 - 移动到按钮旁边 */}
        {errors.submit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-3 rounded-xl text-sm mb-4"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #ef4444',
              color: '#ef4444',
            }}
          >
            ⚠️ {errors.submit}
          </motion.div>
        )}

        {/* 提交按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button
            type="submit"
            disabled={uploading}
            whileHover={{ scale: uploading ? 1 : 1.02 }}
            whileTap={{ scale: uploading ? 1 : 0.98 }}
            className="flex-1 py-4 rounded-xl font-semibold text-white text-lg transition-all"
            style={{
              backgroundColor: '#6366f1',
              opacity: uploading ? 0.7 : 1,
            }}
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uploading {uploadProgress}%...
              </span>
            ) : (
              '🚀 Publish Project'
            )}
          </motion.button>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            disabled={uploading}
            className="px-8 py-4 rounded-xl font-semibold transition-all"
            style={{
              backgroundColor: '#141414',
              border: '1px solid #262626',
              color: '#9ca3af',
            }}
          >
            Cancel
          </button>
        </motion.div>
      </form>
    </div>
  );
}
