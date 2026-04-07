import axios from 'axios';
//创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 60000, // 60秒超时，用于处理大文件上传
});
//请求拦截器：自动添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//响应拦截器：统一处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.response?.status === 401) {
        //token过期，清除登录状态
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
export default api;
