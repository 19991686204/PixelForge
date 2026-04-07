# PixelForge 项目说明

## 项目介绍

PixelForge 是一个创意作品分享平台，允许用户上传、分享、点赞、收藏和评论各种创意作品，如图片和视频。

## 技术栈

- **前端**：React、TypeScript、Framer Motion、React Router
- **后端**：Node.js、Express、MongoDB、Mongoose
- **存储**：Cloudinary（用于图片和视频存储）
- **认证**：JWT（JSON Web Token）

## 安装和运行

### 1. 克隆项目

```bash
git clone https://github.com/你的用户名/PixelForge.git
cd PixelForge
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境变量设置

在项目根目录创建 `.env` 文件，添加以下内容：

```env
# 服务器配置
PORT=5000
NODE_ENV=development

# MongoDB 连接字符串
MONGO_URI=mongodb://localhost:27017/pixelforge

# JWT 密钥
JWT_SECRET=你的JWT密钥

# Cloudinary 配置
CLOUDINARY_CLOUD_NAME=你的Cloudinary云名称
CLOUDINARY_API_KEY=你的Cloudinary API密钥
CLOUDINARY_API_SECRET=你的Cloudinary API密钥
```

### 4. 数据库设置

#### 方式一：使用本地 MongoDB

1. 安装并启动 MongoDB 服务
2. 创建名为 `pixelforge` 的数据库

#### 方式二：使用 MongoDB Atlas（云数据库）

1. 访问 [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. 创建一个免费账户
3. 创建一个新的集群
4. 获取连接字符串并更新 `.env` 文件中的 `MONGO_URI`

### 5. 运行项目

#### 开发模式

```bash
# 启动后端服务器
npm run server

# 启动前端开发服务器
npm run client
```

#### 生产模式

```bash
# 构建前端
npm run build

# 启动服务器
npm start
```

## 功能实现

### 1. 用户认证
- 注册、登录、退出功能
- JWT 令牌认证
- 用户信息管理

### 2. 项目管理
- 创建、编辑、删除项目
- 上传图片和视频
- 项目分类和标签

### 3. 社交功能
- 关注/取消关注用户
- 点赞/取消点赞项目
- 收藏/取消收藏项目
- 评论功能

### 4. 示例内容
- 集成 Cloudinary 示例资产
- 前端模拟数据，确保即使没有后端数据也能展示完整功能

### 5. 本地存储
- 对于示例项目，使用本地存储保存用户操作（关注、点赞、收藏、评论）
- 对于真实项目，操作会同步到后端数据库

## 前端页面介绍

### 1. 首页
- 展示热门项目和推荐设计师
- 搜索功能
- 分类筛选

### 2. 项目详情页
- 项目图片和视频展示
- 项目信息和描述
- 设计师信息
- 点赞、收藏、分享功能
- 评论区

### 3. 示例页面
- 展示 Cloudinary 示例资产
- 支持点赞、收藏、关注操作
- 点击项目进入详情页

### 4. 仪表板
- **我的项目**：管理自己创建的项目
- **关注**：查看关注的设计师
- **点赞**：查看点赞的项目
- **收藏**：查看收藏的项目

### 5. 用户资料页
- 展示用户信息和统计数据
- 展示用户创建的项目
- 关注/取消关注功能

### 6. 登录/注册页
- 用户认证界面
- 表单验证

## 注意事项

1. **示例项目**：示例项目（如 Cloudinary 示例资产）是前端模拟数据，操作会保存在本地存储中，不会同步到数据库。

2. **真实项目**：用户创建的项目会保存在数据库中，操作会同步到数据库。

3. **本地存储**：本地存储仅存在于浏览器中，清除浏览器缓存或使用不同浏览器会导致数据丢失。

4. **Cloudinary**：需要配置 Cloudinary 账户才能使用图片和视频上传功能。

5. **数据库**：需要设置 MongoDB 数据库才能保存用户数据和项目数据。

## 项目结构

```
PixelForge/
├── backend/           # 后端代码
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 数据模型
│   │   ├── routes/         # 路由
│   │   ├── utils/          # 工具函数
│   │   └── server.ts       # 服务器入口
├── frontend/          # 前端代码
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── context/        # 上下文
│   │   ├── pages/          # 页面
│   │   ├── utils/          # 工具函数
│   │   ├── App.tsx         # 应用入口
│   │   └── index.tsx       # 渲染入口
├── .env                # 环境变量
├── package.json        # 项目配置
└── README.md           # 项目说明
```

## 常见问题

### 1. 为什么示例项目的操作没有保存到数据库？

示例项目是前端模拟数据，不存在于后端数据库中，因此操作会保存在本地存储中。

### 2. 如何创建真实项目？

登录后，进入仪表板，点击 "Create Project" 按钮创建真实项目。

### 3. 为什么上传图片失败？

可能是因为没有配置 Cloudinary 账户，或者 API 密钥不正确。

### 4. 如何重置密码？

目前项目暂未实现密码重置功能，后续会添加。

## 贡献

欢迎贡献代码和提出问题！

## 许可证

MIT License