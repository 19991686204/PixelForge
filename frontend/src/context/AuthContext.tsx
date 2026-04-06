import React,{ createContext,useContext, useState, useEffect, ReactNode } from 'react';
import api from '../utils/api';
//用户类型自定义
interface User {
  id: string;
  username: string;
  email: string;
  role:'designer'|'company' |'admin';
  avatar?: string;
  emailVerified: boolean;
}
//Context类型自定义
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: 'designer' | 'company') => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}
// 创建 Context
const AuthContext = createContext<AuthContextType | null>(null);
// Provider 组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // 初始化：从 localStorage 读取用户信息
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // 清除无效的用户数据
        localStorage.removeItem('user');
        setUser(null);
      }
      // 验证 token 是否有效
      api.get('/auth/me')
        .then(res => {
          setUser(res.data.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.data.user));
        })
        .catch(() => {
          // token 失效，清除登录状态
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  // 登录方法
  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = response.data.data || {};
    if (!newToken || !newUser) {
      throw new Error('Invalid response from server');
    }
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // 注册方法
  const register = async (username: string, email: string, password: string, role: 'designer' | 'company') => {
    const response = await api.post('/auth/register', { username, email, password, role });
    const { token: newToken, user: newUser } = response.data.data || {};
    if (!newToken || !newUser) {
      throw new Error('Invalid response from server');
    }
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // 登出方法
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };
  // 更新用户信息
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };
  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      updateUser,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
// 自定义 Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}