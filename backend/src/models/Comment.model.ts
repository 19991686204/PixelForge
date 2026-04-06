import mongoose, { Document, Schema } from 'mongoose';

// ============================================================
// 接口定义
// ============================================================
export interface IComment extends Document {
  content: string;                        // 评论内容
  author: mongoose.Types.ObjectId;        // 评论者（关联User）
  project: mongoose.Types.ObjectId;       // 所属项目（关联Project）
  parent?: mongoose.Types.ObjectId;       // 父评论ID（回复功能用）
  likes: mongoose.Types.ObjectId[];       // 点赞用户列表
  isEdited: boolean;                      // 是否被编辑过
  isDeleted: boolean;                     // 软删除标记
  createdAt: Date;
  updatedAt: Date;

  // 实例方法
  isLikedBy(userId: string): boolean;
}

// ============================================================
// Schema 定义
// ============================================================
const CommentSchema = new Schema<IComment>(
  {
    // ==================== 评论内容 ====================
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      minlength: [1, 'Comment cannot be empty'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      trim: true,
    },

    // ==================== 关联字段 ====================

    // 评论者：关联 User 模型
    // 查询时用 populate('author', 'username avatar')
    // 可以拿到评论者的用户名和头像
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },

    // 所属项目：关联 Project 模型
    // 通过这个字段可以查询某个项目下的所有评论
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },

    // 父评论：实现评论回复功能
    // 如果是顶级评论，parent 为 null
    // 如果是回复某条评论，parent 为那条评论的 _id
    //
    // 结构示意：
    // 评论A (parent: null)
    //   └── 回复B (parent: 评论A._id)
    //   └── 回复C (parent: 评论A._id)
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },

    // ==================== 互动数据 ====================
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // ==================== 状态标记 ====================

    // 是否被编辑过
    // 编辑后前端可以显示 "(edited)" 提示
    isEdited: {
      type: Boolean,
      default: false,
    },

    // 软删除：不真正删除数据
    // 而是标记为已删除，前端显示 "This comment has been deleted"
    // 这样回复链不会断掉
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ============================================================
// 索引
// ============================================================

// 查询某个项目下的所有评论，按时间排序
// 使用场景：打开项目详情页，加载评论列表
CommentSchema.index({ project: 1, createdAt: -1 });

// 查询某个用户发的所有评论
// 使用场景：个人主页显示评论历史
CommentSchema.index({ author: 1, createdAt: -1 });

// 查询某条评论的所有回复
// 使用场景：展开评论的回复列表
CommentSchema.index({ parent: 1, createdAt: 1 });

// ============================================================
// 虚拟字段
// ============================================================

// 点赞数（从 likes 数组长度动态计算）
CommentSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// 回复列表（关联查询子评论）
// 使用场景：populate('replies') 获取某条评论的所有回复
CommentSchema.virtual('replies', {
  ref: 'Comment',       // 关联自身（自关联）
  localField: '_id',    // 本文档的 _id
  foreignField: 'parent', // 子评论的 parent 字段
});

// ============================================================
// 中间件
// ============================================================

// 保存前：过滤敏感词（简单示例）
(CommentSchema as any).pre('save', function (this: any) {
  // 敏感词列表（实际项目可以从数据库或配置文件读取）
  const bannedWords = ['spam', 'abuse'];

  const contentLower = this.content.toLowerCase();
  const hasBannedWord = bannedWords.some(word =>
    contentLower.includes(word)
  );

  if (hasBannedWord) {
    throw new Error('Comment contains inappropriate content');
  }
});

// 软删除后：清空内容保护隐私
// 当 isDeleted 被设为 true 时，自动清空评论内容
(CommentSchema as any).pre('save', function (this: any) {
  if (this.isModified('isDeleted') && this.isDeleted) {
    this.content = '[This comment has been deleted]';
    this.likes = [];
  }
});

// ============================================================
// 实例方法
// ============================================================

// 检查某用户是否点赞了这条评论
// 使用方式：comment.isLikedBy(userId)
CommentSchema.methods.isLikedBy = function (userId: string): boolean {
  return this.likes.some(
    (id: mongoose.Types.ObjectId) => id.toString() === userId
  );
};

// ============================================================
// 静态方法
// ============================================================

// 获取某个项目的顶级评论（不含回复）
// 使用方式：Comment.findByProject(projectId, page, limit)
CommentSchema.statics.findByProject = function (
  projectId: string,
  page = 1,
  limit = 20
) {
  return this.find({
    project: projectId,
    parent: null,        // 只查顶级评论
    isDeleted: false,
  })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('author', 'username avatar')  // 填充评论者信息
    .populate({
      path: 'replies',                      // 填充回复列表
      match: { isDeleted: false },          // 只显示未删除的回复
      populate: {
        path: 'author',                     // 填充回复者信息
        select: 'username avatar',
      },
    });
};

export default mongoose.model<IComment>('Comment', CommentSchema);
