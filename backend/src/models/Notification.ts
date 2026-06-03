import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'application' | 'shortlist' | 'rejection' | 'interview' | 'offer' | 'system';
  isRead: boolean;
  link?: string;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['application', 'shortlist', 'rejection', 'interview', 'offer', 'system'],
      default: 'system',
    },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
