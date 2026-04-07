import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import session from 'express-session';
import path from 'path';
import passport from './config/passport.config';

// 路由
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/project.routes';
import userRoutes from './routes/user.routes';
import commentRoutes from './routes/comment.routes';
import notificationRoutes from './routes/notification.routes';

// 中间件
import { errorHandler, notFound } from './middleware/error.middleware';
import { requestLogger } from './middleware/logger.middleware';


const app = express();
const PORT = process.env.PORT || 5000;

// ========== 基础中间件 ==========
app.use(cors({
  origin: process.env.CLIENT_URL || 'https://my-pixelforge.netlify.app',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志
app.use(requestLogger);

// 静态文件（临时上传目录）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Session（OAuth 需要）
app.use(session({
  secret: process.env.SESSION_SECRET || 'pixelforge-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// ========== API 路由 ==========
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

// 健康检查接口
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
  });
});

// ========== 错误处理（必须放在最后）==========
app.use(notFound);
app.use(errorHandler);

// ========== 数据库连接 ==========
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pixelforge')
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

export default app;
