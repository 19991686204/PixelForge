import mongoose, { Document, Schema } from 'mongoose';

// ============================================================
// 接口定义：告诉 TypeScript 这个模型有哪些字段
// ============================================================
export interface IProject extends Document {
  // 基础信息
  title: string;
  description: string;
  slug: string;           // URL标识符，比如 "my-cool-project-1234"

  // 分类与标签
  category: string;
  tags: string[];

  // 图片资源
  coverImage: string;     // 封面图
  images: string[];       // 项目图片集
  videos: string[];       // 项目视频集

  // 关联用户（外键）
  designer: mongoose.Types.ObjectId;

  // 互动数据
  likes: mongoose.Types.ObjectId[];
  saved: mongoose.Types.ObjectId[];
  views: number;

  // 项目详情
  tools: string[];        // 使用的工具，比如 ['Figma', 'PS']
  client?: string;        // 客户名称（可选）
  projectUrl?: string;    // 项目链接（可选）

  // 状态控制
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  allowComments: boolean;
  isPrivate: boolean;

  // 时间
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;

  // 实例方法
  isLikedBy(userId: string): boolean;
  incrementViews(): Promise<void>;
}

// ============================================================
// Schema 定义：数据库的具体结构和规则
// ============================================================
const ProjectSchema = new Schema<IProject>(
  {
    // ==================== 基础信息 ====================
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    // slug 是自动生成的，不需要用户填写
    // 比如标题是 "My Cool Project" → slug 是 "my-cool-project-1703123456789"
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    // ==================== 分类与标签 ====================
    category: {
      type: String,
      required: [true, 'Category is required'],
      // enum 限制只能是这些值
      enum: {
        values: [
          'UI/UX',
          'Graphic Design',
          'Illustration',
          '3D',
          'Motion Graphics',
          'Branding',
          'Photography',
          'Web Design',
          'Product Design',
          'Typography',
        ],
        message: '{VALUE} is not a valid category',
      },
    },

    tags: {
      type: [String],
      default: [],
      validate: {
        // 自定义验证：最多10个标签
        validator: function (v: string[]) {
          return v.length <= 10;
        },
        message: 'Cannot have more than 10 tags',
      },
    },

    // ==================== 图片资源 ====================
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },

    images: {
      type: [String],
      required: true,
      validate: {
        // 最多20张（允许0张，当只上传视频时）
        validator: function (v: string[]) {
          return v.length <= 20;
        },
        message: 'Cannot have more than 20 images',
      },
    },

    videos: {
      type: [String],
      default: [],
      validate: {
        // 最多5个视频
        validator: function (v: string[]) {
          return v.length <= 5;
        },
        message: 'Cannot have more than 5 videos',
      },
    },

    // ==================== 关联用户 ====================
    // ObjectId 是 MongoDB 的主键类型
    // ref: 'User' 表示关联到 User 模型
    // 通过 populate() 可以自动填充用户信息
    designer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Designer is required'],
    },

    // ==================== 互动数据 ====================
    // likes 存储点赞用户的 ID 数组
    // 通过数组长度可以知道点赞数量
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },

    // saved 存储收藏用户的 ID 数组
    saved: {
      type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
      default: [],
    },

    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ==================== 项目详情 ====================
    tools: {
      type: [String],
      default: [],
    },

    client: {
      type: String,
      maxlength: 100,
    },

    projectUrl: {
      type: String,
      // 验证必须是合法的 URL 格式
      match: [/^https?:\/\/.+/, 'Please provide a valid URL'],
    },

    // ==================== 状态控制 ====================
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'published',
    },

    featured: {
      type: Boolean,
      default: false,
    },

    allowComments: {
      type: Boolean,
      default: true,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
    },
  },
  {
    // timestamps: true 会自动添加 createdAt 和 updatedAt
    timestamps: true,
    // toJSON 让虚拟字段也能被序列化
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================
// 索引：加快数据库查询速度
// ============================================================

// 按设计师查项目，按时间倒序
ProjectSchema.index({ designer: 1, createdAt: -1 });

// 按分类查精选项目
ProjectSchema.index({ category: 1, featured: 1 });

// 标签搜索
ProjectSchema.index({ tags: 1 });

// 热门排序（按浏览量）
ProjectSchema.index({ views: -1 });

// 全文搜索（标题和描述）
ProjectSchema.index({ title: 'text', description: 'text' });

// ============================================================
// 虚拟字段：不存数据库，但可以动态计算
// ============================================================

// 点赞数量（从 likes 数组长度计算）
ProjectSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// 关联评论（通过 Comment 模型查询）
ProjectSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'project',
});

// ============================================================
// 中间件：在数据库操作前/后自动执行
// ============================================================

// 保存前：自动生成 slug
(ProjectSchema as any).pre('save', function(this: any) {
  // 只在标题改变时重新生成 slug
  if (this.isModified('title')) {
    this.slug =
      this.title
        .toLowerCase()
        // 把空格和特殊字符替换成 -
        .replace(/[^a-z0-9]+/g, '-')
        // 去掉首尾的 -
        .replace(/^-+|-+$/g, '') +
      '-'
      +
      Date.now(); // 加时间戳防止重复
  }

  // 第一次发布时记录发布时间
  if (
    this.isModified('status') &&
    this.status === 'published' &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
});

// 删除项目后：同步更新设计师的统计数据
ProjectSchema.post(
  'deleteOne',
  { document: true, query: false },
  async function () {
    try {
      const User = mongoose.model('User');
      const designer = await User.findById(this.designer);
      if (designer && typeof designer.updateStats === 'function') {
        await designer.updateStats();
      }
    } catch (error) {
      console.error('Failed to update designer stats:', error);
    }
  }
);

// ============================================================
// 实例方法：可以在项目实例上调用
// ============================================================

// 检查某个用户是否点赞了这个项目
// 用法：project.isLikedBy(userId)
ProjectSchema.methods.isLikedBy = function (userId: string): boolean {
  return this.likes.some(
    (id: mongoose.Types.ObjectId) => id.toString() === userId
  );
};

// 检查某个用户是否收藏了这个项目
// 用法：project.isSavedBy(userId)
ProjectSchema.methods.isSavedBy = function (userId: string): boolean {
  return this.saved.some(
    (id: mongoose.Types.ObjectId) => id.toString() === userId
  );
};

// ============================================================
// 静态方法：可以在 Project 类上直接调用
// ============================================================

// 查找热门项目
// 用法：Project.findTrending(10)
ProjectSchema.statics.findTrending = function (limit = 10) {
  return this.find({ status: 'published', isPrivate: false })
    .sort({ views: -1, createdAt: -1 })
    .limit(limit)
    .populate('designer', 'username avatar');
};

// 查找精选项目
// 用法：Project.findFeatured(6)
ProjectSchema.statics.findFeatured = function (limit = 6) {
  return this.find({
    status: 'published',
    featured: true,
    isPrivate: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('designer', 'username avatar');
};

// ============================================================
// 实例方法：可以在项目实例上调用
// ============================================================

// 增加浏览量
ProjectSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

export default mongoose.model<IProject>('Project', ProjectSchema);
