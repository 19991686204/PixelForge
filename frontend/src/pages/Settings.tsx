import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [profileForm, setProfileForm] = useState({
    displayName: user?.username || '',
    bio: '',
    location: '',
    website: '',
    skills: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // 保存个人资料
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('displayName', profileForm.displayName);
      formData.append('bio', profileForm.bio);
      formData.append('location', profileForm.location);
      formData.append('website', profileForm.website);
      formData.append('skills', JSON.stringify(
        profileForm.skills.split(',').map(s => s.trim()).filter(Boolean)
      ));

      const response = await api.put('/users/profile', formData);
      updateUser(response.data.data);
      setMessage('Profile updated successfully!');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: 'profile', label: 'Profile' },
    { id: 'password', label: 'Password' },
    { id: 'account', label: 'Account' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      {/* 标签页导航 */}
      <div className="flex gap-1 mb-8 p-1 rounded-xl"
        style={{ backgroundColor: '#141414' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: activeTab === tab.id ? '#6366f1' : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : '#9ca3af',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 消息提示 */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-3 rounded-lg mb-6 text-sm"
          style={{
            backgroundColor: message.includes('success')
              ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${message.includes('success') ? '#22c55e' : '#ef4444'}`,
            color: message.includes('success') ? '#22c55e' : '#ef4444',
          }}
        >
          {message}
        </motion.div>
      )}

      {/* 个人资料设置 */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <div className="rounded-xl p-6"
            style={{ backgroundColor: '#141414', border: '1px solid #262626' }}>
            <h2 className="text-lg font-semibold mb-6">Profile Information</h2>

            {[
              { label: 'Display Name', key: 'displayName', placeholder: 'Your display name' },
              { label: 'Location', key: 'location', placeholder: 'San Francisco, CA' },
              { label: 'Website', key: 'website', placeholder: 'https://yourwebsite.com' },
              { label: 'Skills', key: 'skills', placeholder: 'Figma, UI Design, Illustration (comma separated)' },
            ].map(field => (
              <div key={field.key} className="mb-4">
                <label className="block text-sm font-medium mb-2"
                  style={{ color: '#d1d5db' }}>
                  {field.label}
                </label>
                <input
                  type="text"
                  value={profileForm[field.key as keyof typeof profileForm]}
                  onChange={(e) => setProfileForm({
                    ...profileForm,
                    [field.key]: e.target.value
                  })}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all"
                  style={{
                    backgroundColor: '#0a0a0a',
                    border: '1px solid #262626',
                    color: '#e5e5e5',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#262626'}
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2"
                style={{ color: '#d1d5db' }}>
                Bio
              </label>
              <textarea
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 rounded-lg outline-none resize-none transition-all"
                style={{
                  backgroundColor: '#0a0a0a',
                  border: '1px solid #262626',
                  color: '#e5e5e5',
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#262626'}
              />
              <p className="text-xs mt-1 text-right" style={{ color: '#6b7280' }}>
                {profileForm.bio.length}/500
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl font-semibold text-white transition-all"
              style={{ backgroundColor: saving ? '#4f46e5' : '#6366f1', opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {/* 账号设置 */}
      {activeTab === 'account' && (
        <div className="rounded-xl p-6"
          style={{ backgroundColor: '#141414', border: '1px solid #262626' }}>
          <h2 className="text-lg font-semibold mb-6">Account Settings</h2>

          <div className="p-4 rounded-lg mb-6"
            style={{ backgroundColor: '#1a1a1a', border: '1px solid #262626' }}>
            <p className="text-sm mb-1" style={{ color: '#9ca3af' }}>Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>

          <div className="pt-6" style={{ borderTop: '1px solid #262626' }}>
            <h3 className="text-base font-semibold mb-2" style={{ color: '#ef4444' }}>
              Danger Zone
            </h3>
            <p className="text-sm mb-4" style={{ color: '#6b7280' }}>
              Once you delete your account, there is no going back.
            </p>
            <button
              onClick={logout}
              className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
