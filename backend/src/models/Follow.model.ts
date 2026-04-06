import mongoose, { Document, Schema } from 'mongoose';

export interface IFollow extends Document {
  follower: mongoose.Types.ObjectId;    // 关注者
  following: mongoose.Types.ObjectId;   // 被关注者
  createdAt: Date;
}

const FollowSchema = new Schema<IFollow>({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 复合唯一索引：防止重复关注
FollowSchema.index({ follower: 1, following: 1 }, { unique: true });

// 查询索引
FollowSchema.index({ follower: 1, createdAt: -1 });
FollowSchema.index({ following: 1, createdAt: -1 });

// 防止自己关注自己
(FollowSchema as any).pre('save', function(this: any) {
  if (this.follower.toString() === this.following.toString()) {
    throw new Error('Cannot follow yourself');
  }
});

export default mongoose.model<IFollow>('Follow', FollowSchema);
