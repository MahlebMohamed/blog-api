import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import type { Request, Response } from 'express';

import Blog, { IBlog } from '@/models/blog.model';
import User from '@/models/user.model';
import { deleteImageLocally } from '@/utils/saveImageLocally';
import { logger } from '@/utils/winston';
import slugify from 'slugify';
import config from '@/config';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

interface QueryType {
  status?: 'draft' | 'published';
}

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;
type BlogDataUpdate = Partial<
  Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>
>;

export async function createBlog(req: Request, res: Response) {
  const { title, content, banner, status } = req.body as BlogData;
  const userId = req.userId;
  const cleanContent = purify.sanitize(content);

  try {
    const newBlog = await Blog.create({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      content: cleanContent,
      banner,
      status,
      author: userId,
    });

    logger.info('New blog created');
    res.status(201).json({
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}

export async function getAllBlogs(req: Request, res: Response) {
  const limit =
    parseInt(req.query.limit as string, 10) || config.LIMIT_GET_ALL_BLOGS;
  const page = parseInt(req.query.page as string, 10) || 1;
  const skip = (page - 1) * limit;

  const userId = req.userId;
  const query: QueryType = {};

  try {
    const user = await User.findById(userId).select('role').lean().exec();
    if (user?.role === 'user') {
      query.status = 'published';
    }

    const blogs = await Blog.find(query)
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .skip(skip)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    res.status(200).json({
      total: blogs.length,
      page,
      limit,
      blogs,
    });
  } catch (error) {
    logger.error('Error fetching blogs:', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}

export async function getBlogByUserId(req: Request, res: Response) {
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const page = parseInt(req.query.page as string, 10) || 1;
  const skip = (page - 1) * limit;
  const { userId } = req.params;
  const currentUserId = req.userId;
  const query: QueryType = {};

  try {
    const currentUser = await User.findById(currentUserId)
      .select('role')
      .lean()
      .exec();
    if (currentUser?.role === 'user') {
      query.status = 'published';
    }

    const blogs = await Blog.find({ author: userId, ...query })
      .select('-banner.publicId -__v')
      .populate('author', '-createdAt -updatedAt -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    res.status(200).json({
      total: blogs.length,
      blogs,
    });
  } catch (error) {
    logger.error('Error fetching blogs by user ID:', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}

export async function getBlogBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findOne({ slug })
      .populate('author', 'username email')
      .exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (user?.role === 'user' && blog.status === 'draft') {
      res.status(403).json({
        code: 'Forbidden',
        message: 'You do not have permission to access this blog',
      });
      return;
    }

    logger.info(`Blog fetched by slug: ${slug}`);
    res.status(200).json({
      blog,
    });
  } catch (error) {
    logger.error('Error fetching blog by slug', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}

export async function updateBlog(req: Request, res: Response) {
  const { title, content, banner, status } = req.body as BlogDataUpdate;
  const userId = req.userId;
  const blogId = req.params.blogId;
  let cleanContent: string | undefined;

  try {
    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId).exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (
      user?.role === 'user' &&
      blog.author.toString() !== userId?.toString()
    ) {
      res.status(403).json({
        code: 'Forbidden',
        message: 'You do not have permission to update this blog',
      });
      return;
    }

    if (content) cleanContent = purify.sanitize(content);

    await Blog.findByIdAndUpdate(blogId, {
      ...(title && { title }),
      ...(content && { content: cleanContent }),
      ...(banner && { banner }),
      ...(status && { status }),
    });

    logger.info(`Blog updated: ${blogId}`);
    res.status(200).json({
      message: 'Blog updated successfully',
    });
  } catch (error) {
    logger.error('Error updating blog:', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}

export async function deleteBlog(req: Request, res: Response) {
  const { blogId } = req.params;
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select('role').lean().exec();
    const blog = await Blog.findById(blogId).exec();

    if (!blog) {
      res.status(404).json({
        code: 'NotFound',
        message: 'Blog not found',
      });
      return;
    }

    if (
      user?.role !== 'admin' &&
      blog.author.toString() !== userId?.toString()
    ) {
      res.status(403).json({
        code: 'Forbidden',
        message: 'You are not authorized to delete this blog',
      });
      return;
    }

    if (blog.banner?.filename) {
      await deleteImageLocally(blog.banner.filename);
      logger.info(`Blog banner deleted: ${blog.banner.filename}`);
    }

    await Blog.findByIdAndDelete(blogId);

    logger.info(`Blog deleted: ${blogId}`);
    res.status(200).json({
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting blog:', error);
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
  }
}
