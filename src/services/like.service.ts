import Blog from '@/models/blog.model';
import Comment from '@/models/comment.model';
import Like from '@/models/like.model';

import type { Request, Response } from 'express';

export async function likeBlog(req: Request, res: Response) {
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const blog = await Blog.findById(blogId).select('likesCount title').exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    const existingLike = await Like.findOne({ blogId, userId }).exec();
    if (existingLike) {
      res.status(400).json({
        code: 'BadRequest',
        message: 'You have already liked this blog',
      });
      return;
    }

    await Like.create({ blogId, userId });

    blog.likesCount++;
    await blog.save();

    res.status(200).json({
      message: 'Blog liked successfully',
      title: blog.title,
      likesCount: blog.likesCount,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}

export async function unlikeBlog(req: Request, res: Response) {
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const existingLike = await Like.findOne({ blogId, userId }).exec();
    if (!existingLike) {
      res.status(400).json({
        code: 'BadRequest',
        message: 'You have not liked this blog',
      });
      return;
    }

    await Like.deleteOne({ _id: existingLike._id }).exec();
    await Blog.findByIdAndUpdate(blogId, { $inc: { likesCount: -1 } }).exec();

    res.status(200).json({
      message: 'Blog unliked successfully',
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}

export async function likeComment(req: Request, res: Response) {
  const { commentId } = req.params;
  const userId = req.userId;

  try {
    const comment = await Comment.findById(commentId)
      .select('likesCount content')
      .exec();
    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found',
      });
      return;
    }

    const existingLike = await Like.findOne({ commentId, userId }).exec();
    if (existingLike) {
      res.status(400).json({
        code: 'BadRequest',
        message: 'You have already liked this comment',
      });
      return;
    }

    await Like.create({ commentId, userId });

    comment.likesCount++;
    await comment.save();

    res.status(200).json({
      message: 'Comment liked successfully',
      likesCount: comment.likesCount,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}

export async function unlikeComment(req: Request, res: Response) {
  const { commentId } = req.params;
  const userId = req.userId;

  try {
    const existingLike = await Like.findOne({ commentId, userId }).exec();
    if (!existingLike) {
      res.status(400).json({
        code: 'BadRequest',
        message: 'You have not liked this comment',
      });
      return;
    }

    await Like.deleteOne({ _id: existingLike._id }).exec();
    await Comment.findByIdAndUpdate(commentId, {
      $inc: { likesCount: -1 },
    }).exec();

    res.status(200).json({
      message: 'Comment unliked successfully',
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}
