import { model, Schema, Types } from 'mongoose';

export interface IBlog {
  title: string;
  slug: string;
  content: string;
  banner: {
    filename: string;
    url: string;
    width: number;
    height: number;
  };
  author: Types.ObjectId;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  status: 'draft' | 'published';
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      maxLength: [100, 'Title cannot exceed 100 characters'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
    },
    banner: {
      publicId: { type: String, required: [true, 'publicId is required'] },
      url: { type: String, required: [true, 'url is required'] },
      width: { type: Number, required: [true, 'width is required'] },
      height: { type: Number, required: [true, 'height is required'] },
    },
    author: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export default model<IBlog>('Blog', blogSchema);
