import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
  blogId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  commentId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ILike>('Like', likeSchema);
