# PixelForge

一个现代化的创意作品展示平台，为设计师和创意工作者提供作品展示、互动交流和项目管理功能。

## 功能特性

### 1. 用户认证系统
- **用户注册**：支持邮箱注册，自动验证邮箱格式
- **用户登录**：支持邮箱和密码登录，JWT 认证
- **密码重置**：忘记密码功能，通过邮箱发送重置链接
- **用户登出**：安全的登出功能
- **用户信息**：查看和管理个人资料

### 2. 项目展示
- **作品展示**：支持图片和视频展示
- **项目分类**：按类别筛选作品
- **项目详情**：查看项目详细信息
- **媒体预览**：支持图片和视频的预览功能

### 3. 互动功能
- **点赞**：为喜欢的作品点赞
- **收藏**：收藏感兴趣的作品
- **关注**：关注感兴趣的设计师
- **评论**：对作品发表评论

### 4. 用户仪表板
- **个人主页**：查看个人作品统计
- **关注列表**：查看已关注的设计师
- **点赞列表**：查看点赞过的作品
- **收藏列表**：查看收藏的作品

### 5. 后台管理
- **项目管理**：上传和管理作品
- **用户管理**：管理用户账户
- **数据统计**：查看平台统计数据

## 技术栈

### 前端
- **React**：前端框架
- **TypeScript**：类型安全
- **Framer Motion**：动画效果
- **React Router**：路由管理
- **Axios**：HTTP 请求
- **Tailwind CSS**：样式框架

### 后端
- **Node.js**：运行环境
- **Express**：Web 框架
- **TypeScript**：类型安全
- **MongoDB**：数据库
- **Mongoose**：ODM
- **JWT**：认证
- **Nodemailer**：邮件发送
- **Bcrypt**：密码加密
- **Cloudinary**：图片和视频存储

## 项目结构

```
PixelForge/
├── frontend/               # 前端项目
│   ├── public/            # 静态资源
│   ├── src/               # 源代码
│   │   ├── components/    # 组件
│   │   ├── pages/         # 页面
│   │   ├── utils/         # 工具函数
│   │   └── App.tsx        # 主应用
│   └── package.json       # 依赖配置
└── backend/               # 后端项目
    ├── src/              # 源代码
    │   ├── controllers/  # 控制器
    │   ├── models/       # 数据模型
    │   ├── routes/       # 路由
    │   ├── middleware/   # 中间件
    │   └── server.ts     # 服务器入口
    └── package.json      # 依赖配置
```

## 安装和运行

### 前置要求
- Node.js (v16 或更高版本)
- MongoDB (v4.4 或更高版本)
- npm 或 yarn

### 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd backend
npm install
```

### 配置环境变量

在 `backend/.env` 文件中配置以下环境变量：

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pixelforge
JWT_SECRET=your-jwt-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
SMTP_HOST=smtp.qq.com
SMTP_PORT=587
```

**邮箱配置说明**：
- 系统默认使用 QQ 邮箱的 SMTP 服务器发送邮件
- 如果需要使用其他邮箱服务，请修改 `SMTP_HOST` 和 `SMTP_PORT`
- 支持的邮箱服务：
  - **QQ 邮箱**：smtp.qq.com, 端口 587
  - **163 邮箱**：smtp.163.com, 端口 465
  - **Gmail**：smtp.gmail.com, 端口 587
  - **Outlook**：smtp-mail.outlook.com, 端口 587
- 邮箱地址可以是任意邮箱，不限于配置的发件人邮箱

### 运行项目

```bash
# 运行后端服务器
cd backend
npm run dev

# 运行前端开发服务器
cd frontend
npm run client
```

访问 `http://localhost:3000` 查看应用。

## API 文档

### 认证 API

#### 注册
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string",
    "role": "designer | company | admin"
  }
  ```

#### 登录
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

#### 获取当前用户
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

#### 忘记密码
- **URL**: `/api/auth/forgot-password`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "email": "string"
  }
  ```

#### 重置密码
- **URL**: `/api/auth/reset-password`
- **Method**: `POST`
- **Body**: 
  ```json
  {
    "token": "string",
    "password": "string"
  }
  ```

### 项目 API

#### 获取所有项目
- **URL**: `/api/projects`
- **Method**: `GET`

#### 获取项目详情
- **URL**: `/api/projects/:id`
- **Method**: `GET`

#### 创建项目
- **URL**: `/api/projects`
- **Method**: `POST`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

#### 更新项目
- **URL**: `/api/projects/:id`
- **Method**: `PUT`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

#### 删除项目
- **URL**: `/api/projects/:id`
- **Method**: `DELETE`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

#### 点赞项目
- **URL**: `/api/projects/:id/like`
- **Method**: `POST`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

#### 收藏项目
- **URL**: `/api/projects/:id/save`
- **Method**: `POST`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### 评论 API

#### 获取项目评论
- **URL**: `/api/projects/:id/comments`
- **Method**: `GET`

#### 添加评论
- **URL**: `/api/projects/:id/comments`
- **Method**: `POST`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

#### 删除评论
- **URL**: `/api/comments/:id`
- **Method**: `DELETE`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

### 用户 API

#### 获取用户信息
- **URL**: `/api/users/:id`
- **Method**: `GET`

#### 获取用户关注列表
- **URL**: `/api/users/:id/following`
- **Method**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

#### 获取用户粉丝列表
- **URL**: `/api/users/:id/followers`
- **Method**: `GET`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

#### 关注用户
- **URL**: `/api/users/:id/follow`
- **Method**: `POST`
- **Headers**: 
  ```
  Authorization: Bearer <token>
  ```

## 数据模型

### User 模型
- username: 用户名
- email: 邮箱
- password: 密码（加密存储）
- role: 用户角色
- avatar: 头像
- bio: 个人简介
- skills: 技能标签
- stats: 统计数据
- settings: 用户设置

### Project 模型
- title: 项目标题
- description: 项目描述
- designer: 设计师 ID
- media: 媒体文件
- category: 分类
- likes: 点赞列表
- saved: 收藏列表
- views: 浏览次数
- createdAt: 创建时间

### Comment 模型
- content: 评论内容
- project: 项目 ID
- user: 用户 ID
- createdAt: 创建时间

### Follow 模型
- follower: 关注者 ID
- following: 被关注者 ID
- createdAt: 创建时间

## 功能说明

### 用户认证
系统使用 JWT 进行用户认证。用户登录后会获得一个 JWT token，该 token 需要在后续请求的 Authorization 头中发送。

### 自定义鼠标光标
系统使用自定义鼠标光标，隐藏了系统默认鼠标，只显示自定义的像素风格光标。

**自定义光标特性**：
- **主光标**：32x32px 的圆环光标，跟随鼠标移动
- **跟随点**：4x4px 的小圆点，提供更精确的定位
- **悬停效果**：在可交互元素上会放大 1.5 倍
- **层级**：z-index 为 60，确保显示在所有元素之上

**Logo 点击行为**：
- **修改说明**：点击 Logo 不再返回首页，而是返回上一页
- **实现方式**：使用 `navigate(-1)` 实现浏览器历史记录后退
- **原因**：提供更符合用户习惯的导航体验，避免强制跳转到首页

**注意**：由于隐藏了系统鼠标，用户可能需要适应自定义光标的操作。如果需要恢复系统鼠标，可以刷新页面或清除浏览器缓存。

### 密码重置
1. 用户在登录页面点击 "Forgot password?"
2. 输入注册邮箱（支持任意邮箱，如 QQ、163、Gmail 等）
3. 系统发送密码重置邮件到用户邮箱（使用配置的 SMTP 服务器）
4. 用户点击邮件中的链接（需要手动复制粘贴到浏览器地址栏）
5. 输入新密码完成重置

**注意**：
- 邮件中的链接需要手动复制粘贴到浏览器地址栏，因为某些邮箱服务（如 QQ 邮箱）会拦截自动跳转链接
- 重置链接有效期为 1 小时
- 如果使用 QQ 邮箱发送邮件，需要在 QQ 邮箱设置中开启 SMTP 服务并获取授权码

### 项目展示
- 支持图片和视频上传
- 支持 Cloudinary 存储
- 支持项目分类和筛选
- 支持项目详情页展示

**上传限制**：
- 图片：最多 20 张，每张最大 10MB
- 视频：最多 5 个，每个最大 10MB
- 支持的视频格式：MP4、MOV、AVI、MKV、WebM
- **注意**：由于 Cloudinary 免费版限制，所有文件大小不能超过 10MB。如需上传更大文件，需要升级 Cloudinary 账号。

### 互动功能
- **点赞**：用户可以为喜欢的作品点赞
- **收藏**：用户可以收藏感兴趣的作品
- **关注**：用户可以关注感兴趣的设计师
- **评论**：用户可以对作品发表评论

### 仪表板
- **个人主页**：显示用户的基本信息和统计数据
- **关注列表**：显示用户关注的设计师
- **点赞列表**：显示用户点赞的作品
- **收藏列表**：显示用户收藏的作品

## 开发说明

### 代码风格
- 使用 TypeScript 进行类型检查
- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 React 最佳实践

### 测试
- 使用 Jest 进行单元测试
- 使用 React Testing Library 进行组件测试

### 部署
- 前端：部署到 Vercel 或 Netlify
- 后端：部署到 Heroku 或 AWS
- 数据库：使用 MongoDB Atlas

## 许可证
MIT License

## 贡献
欢迎提交 Issue 和 Pull Request！

## 联系方式
如有问题，请联系开发者。
