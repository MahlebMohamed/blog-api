import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  blogId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: [true, 'Blog ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
      maxLength: [500, 'Content cannot exceed 500 characters'],
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IComment>('Comment', commentSchema);
