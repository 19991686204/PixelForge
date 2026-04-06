import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// 用户接口定义
export interface IUser extends Document {
  // ========== 基础信息 ==========
  username: string;           // 用户名（唯一）
  email: string;              // 邮箱（唯一）
  password?: string;          // 密码（OAuth用户可能没有）
  
  // ========== 角色与权限 ==========
  role: 'designer' | 'company' | 'admin';  // 用户角色
  emailVerified: boolean;     // 邮箱是否验证
  isActive: boolean;          // 账号是否激活
  isPremium: boolean;         // 是否为付费会员
  
  // ========== 第三方登录 ==========
  provider: 'local' | 'google' | 'github';  // 注册方式
  providerId?: string;        // 第三方平台的用户ID
  
  // ========== 个人资料 ==========
  avatar?: string;            // 头像URL
  coverImage?: string;        // 封面图URL
  bio?: string;               // 个人简介
  displayName?: string;       // 显示名称
  
  // ========== 技能与位置 ==========
  skills?: string[];          // 技能标签 ['UI Design', 'Figma']
  location?: string;          // 所在地 'San Francisco, CA'
  website?: string;           // 个人网站
  
  // ========== 社交链接 ==========
  social?: {
    behance?: string;
    dribbble?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  
  // ========== 统计数据 ==========
  stats: {
    projects: number;         // 项目数量
    followers: number;        // 粉丝数
    following: number;        // 关注数
    likes: number;           // 获得的点赞数
    views: number;           // 作品总浏览量
  };
  
  // ========== 设置 ==========
  settings: {
    emailNotifications: boolean;     // 邮件通知
    pushNotifications: boolean;      // 推送通知
    showEmail: boolean;              // 公开邮箱
    allowMessages: boolean;          // 允许私信
    profileVisibility: 'public' | 'private' | 'followers';  // 资料可见性
  };
  
  // ========== 时间戳 ==========
  createdAt: Date;           // 注册时间
  updatedAt: Date;           // 最后更新时间
  lastLoginAt?: Date;        // 最后登录时间
  
  // ========== 方法 ==========
  comparePassword(candidatePassword: string): Promise<boolean>;
  updateStats(): Promise<void>;
}

const UserSchema = new Schema<IUser>({
  // ========== 基础信息 ==========
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [20, 'Username cannot exceed 20 characters'],
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    index: true,  // 创建索引，加快查询速度
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    index: true,
  },
  
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,  // 查询时默认不返回密码字段
  },
  
  // ========== 角色与权限 ==========
  role: {
    type: String,
    enum: {
      values: ['designer', 'company', 'admin'],
      message: '{VALUE} is not a valid role'
    },
    default: 'designer',
  },
  
  emailVerified: {
    type: Boolean,
    default: false,
  },
  
  isActive: {
    type: Boolean,
    default: true,
  },
  
  isPremium: {
    type: Boolean,
    default: false,
  },
  
  // ========== 第三方登录 ==========
  provider: {
    type: String,
    enum: ['local', 'google', 'github'],
    default: 'local',
  },
  
  providerId: {
    type: String,
    sparse: true,  // 允许多个 null 值
  },
  
  // ========== 个人资料 ==========
  avatar: {
    type: String,
    default: null,
  },
  
  coverImage: {
    type: String,
    default: null,
  },
  
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: '',
  },
  
  displayName: {
    type: String,
    maxlength: 50,
  },
  
  // ========== 技能与位置 ==========
  skills: {
    type: [String],
    default: [],
    validate: {
      validator: function(v: string[]) {
        return v.length <= 20;  // 最多20个技能
      },
      message: 'Cannot have more than 20 skills'
    }
  },
  
  location: {
    type: String,
    maxlength: 100,
  },
  
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please provide a valid URL'],
  },
  
  // ========== 社交链接 ==========
  social: {
    behance: String,
    dribbble: String,
    instagram: String,
    linkedin: String,
    twitter: String,
    github: String,
  },
  
  // ========== 统计数据 ==========
  stats: {
    projects: {
      type: Number,
      default: 0,
      min: 0,
    },
    followers: {
      type: Number,
      default: 0,
      min: 0,
    },
    following: {
      type: Number,
      default: 0,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  
  // ========== 设置 ==========
  settings: {
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
    showEmail: {
      type: Boolean,
      default: false,
    },
    allowMessages: {
      type: Boolean,
      default: true,
    },
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'followers'],
      default: 'public',
    },
  },
  
  // ========== 时间戳 ==========
  lastLoginAt: {
    type: Date,
  },
  
}, {
  timestamps: true,  // 自动创建 createdAt 和 updatedAt
  toJSON: { virtuals: true },  // 序列化时包含虚拟字段
  toObject: { virtuals: true },
});

// ========== 索引 ==========
// 复合索引：加快多字段查询
UserSchema.index({ email: 1, provider: 1 });
UserSchema.index({ username: 1, isActive: 1 });
UserSchema.index({ 'stats.followers': -1 });  // 按粉丝数排序
UserSchema.index({ createdAt: -1 });  // 按注册时间排序

// ========== 虚拟字段 ==========
// 虚拟字段不会保存到数据库，但可以在查询时访问
UserSchema.virtual('projectsList', {
  ref: 'Project',           // 关联的模型
  localField: '_id',        // 本地字段
  foreignField: 'designer', // 外键字段
});

UserSchema.virtual('followersList', {
  ref: 'Follow',
  localField: '_id',
  foreignField: 'following',
});

// ========== 中间件 (Middleware) ==========

// 保存前：密码加密
(UserSchema as any).pre('save', async function(this: any) {
  // 只在密码被修改时才加密
  if (!this.isModified('password') || !this.password) {
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error: any) {
    throw error;
  }
});

// 保存后：更新统计数据
UserSchema.post('save', async function(doc) {
  console.log(`✅ User ${doc.username} saved successfully`);
});

// 删除前：清理关联数据
(UserSchema as any).pre('deleteOne', { document: true, query: false }, async function(this: any) {
  try {
    // 删除用户的所有项目
    await mongoose.model('Project').deleteMany({ designer: this._id });
    
    // 删除关注关系
    await mongoose.model('Follow').deleteMany({
      $or: [{ follower: this._id }, { following: this._id }]
    });
    
    console.log(`🗑️  Cleaned up data for user ${this.username}`);
  } catch (error: any) {
    throw error;
  }
});

// ========== 实例方法 ==========

// 密码比对
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// 更新统计数据
UserSchema.methods.updateStats = async function(): Promise<void> {
  const Project = mongoose.model('Project');
  const Follow = mongoose.model('Follow');
  
  // 统计项目数
  const projectCount = await Project.countDocuments({ designer: this._id });
  
  // 统计粉丝数
  const followerCount = await Follow.countDocuments({ following: this._id });
  
  // 统计关注数
  const followingCount = await Follow.countDocuments({ follower: this._id });
  
  // 统计总点赞数
  const projects = await Project.find({ designer: this._id });
  const totalLikes = projects.reduce((sum, p) => sum + p.likes.length, 0);
  
  // 统计总浏览量
  const totalViews = projects.reduce((sum, p) => sum + p.views, 0);
  
  this.stats = {
    projects: projectCount,
    followers: followerCount,
    following: followingCount,
    likes: totalLikes,
    views: totalViews,
  };
  
  await this.save();
};

// ========== 静态方法 ==========

// 查找活跃用户
UserSchema.statics.findActiveUsers = function() {
  return this.find({ isActive: true }).sort({ 'stats.followers': -1 });
};

// 查找热门设计师
UserSchema.statics.findTopDesigners = function(limit = 10) {
  return this.find({ role: 'designer', isActive: true })
    .sort({ 'stats.followers': -1 })
    .limit(limit)
    .select('username avatar bio stats');
};

export default mongoose.model<IUser>('User', UserSchema);
