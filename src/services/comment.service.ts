import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import type { Request, Response } from 'express';

import Blog from '@/models/blog.model';
import Comment from '@/models/comment.model';
import { logger } from '@/utils/winston';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

export async function createComment(req: Request, res: Response) {
  const { blogId } = req.params;
  const { content } = req.body;
  const userId = req.userId;
  const cleanContent = purify.sanitize(content);

  try {
    const blog = await Blog.findById(blogId)
      .select('commentsCount title')
      .exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    const newComment = await Comment.create({
      blogId,
      userId,
      content: cleanContent,
    });

    blog.commentsCount++;
    await blog.save();

    const populatedComment = await Comment.findById(newComment._id)
      .populate('userId', 'username email')
      .exec();

    logger.info(`Comment created on blog: ${blogId}`);
    res.status(201).json({
      message: 'Comment created successfully',
      comment: populatedComment,
    });
  } catch (error) {
    logger.error('Error creating comment:', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}

export async function getCommentsByBlogId(req: Request, res: Response) {
  const { blogId } = req.params;
  const limit = parseInt(req.query.limit as string, 10) || 20;
  const page = parseInt(req.query.page as string, 10) || 1;
  const skip = (page - 1) * limit;

  try {
    const blog = await Blog.findById(blogId).select('_id').exec();
    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    const comments = await Comment.find({ blogId })
      .populate('userId', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    const total = await Comment.countDocuments({ blogId });

    res.status(200).json({
      total,
      page,
      limit,
      comments,
    });
  } catch (error) {
    logger.error('Error fetching comments:', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}

export async function updateComment(req: Request, res: Response) {
  const { commentId } = req.params;
  const { content } = req.body;
  const userId = req.userId;

  try {
    const comment = await Comment.findById(commentId).exec();

    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found',
      });
      return;
    }

    if (comment.userId.toString() !== userId?.toString()) {
      res.status(403).json({
        code: 'Forbidden',
        message: 'You are not authorized to update this comment',
      });
      return;
    }

    comment.content = content;
    await comment.save();

    logger.info(`Comment updated: ${commentId}`);
    res.status(200).json({
      message: 'Comment updated successfully',
      comment,
    });
  } catch (error) {
    logger.error('Error updating comment:', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}

export async function deleteComment(req: Request, res: Response) {
  const { commentId } = req.params;
  const userId = req.userId;

  try {
    const comment = await Comment.findById(commentId).exec();

    if (!comment) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Comment not found',
      });
      return;
    }

    if (comment.userId.toString() !== userId?.toString()) {
      res.status(403).json({
        code: 'Forbidden',
        message: 'You are not authorized to delete this comment',
      });
      return;
    }

    const blog = await Blog.findById(comment.blogId)
      .select('commentsCount')
      .exec();
    if (blog) {
      blog.commentsCount--;
      await blog.save();
    }

    await Comment.findByIdAndDelete(commentId);

    logger.info(`Comment deleted: ${commentId}`);
    res.status(200).json({
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting comment:', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}
