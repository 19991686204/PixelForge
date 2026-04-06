import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;   // 接收者
  sender?: mongoose.Types.ObjectId;     // 发送者
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  content: string;                      // 通知内容
  link?: string;                        // 相关链接
  isRead: boolean;                      // 是否已读
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'mention', 'system'],
    required: true,
  },
  
  content: {
    type: String,
    required: true,
    maxlength: 500,
  },
  
  link: String,
  
  isRead: {
    type: Boolean,
    default: false,
    index: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// 复合索引
NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

// 自动删除30天前的已读通知
NotificationSchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 2592000,  // 30天
  partialFilterExpression: { isRead: true }
});

export default mongoose.model<INotification>('Notification', NotificationSchema);
