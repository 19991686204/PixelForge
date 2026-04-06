import mongoose, { Document, Schema } from 'mongoose';

// ============================================================
// 接口定义
// ============================================================
export interface IVerificationCode extends Document {
  email: string;        // 发送目标邮箱
  code: string;         // 6位验证码
  type: 'register' | 'reset-password' | 'change-email'; // 验证码用途
  attempts: number;     // 已尝试次数（防止暴力破解）
  createdAt: Date;
  expiresAt: Date;      // 过期时间（10分钟后）
}

// ============================================================
// Schema 定义
// ============================================================
const VerificationCodeSchema = new Schema<IVerificationCode>({

  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
  },

  code: {
    type: String,
    required: [true, 'Code is required'],
    length: 6, // 固定6位
  },

  // 区分验证码的用途
  // register        → 注册新账号
  // reset-password  → 忘记密码
  // change-email    → 修改邮箱
  type: {
    type: String,
    enum: {
      values: ['register', 'reset-password', 'change-email'],
      message: '{VALUE} is not a valid type',
    },
    default: 'register',
  },

  // 记录用户尝试了几次
  // 超过5次就锁定，防止有人暴力猜验证码
  attempts: {
    type: Number,
    default: 0,
    max: [5, 'Too many attempts'],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  // 过期时间由控制器写入
  // 比如：new Date(Date.now() + 10 * 60 * 1000) 表示10分钟后
  expiresAt: {
    type: Date,
    required: true,
  },
});

// ============================================================
// 索引
// ============================================================

// TTL 索引：MongoDB 会自动删除 expiresAt 已过期的文档
// expireAfterSeconds: 0 表示到达 expiresAt 时间点立刻删除
VerificationCodeSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

// 复合索引：同一邮箱同一类型的验证码查询更快
// 比如查询：某邮箱的注册验证码是否存在
VerificationCodeSchema.index({ email: 1, type: 1 });

// ============================================================
// 中间件
// ============================================================

// 每次保存前检查尝试次数
// 超过5次直接拒绝保存
(VerificationCodeSchema as any).pre('save', function (this: any) {
  if (this.attempts >= 5) {
    throw new Error('Too many failed attempts. Please request a new code.');
  }
});

export default mongoose.model<IVerificationCode>(
  'VerificationCode',
  VerificationCodeSchema
);
