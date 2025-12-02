import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import type { Request, Response } from 'express';

import Blog, { IBlog } from '@/models/blog.model';
import { logger } from '@/utils/winston';

const window = new JSDOM('').window;
const purify = DOMPurify(window);

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

export async function createBlog(req: Request, res: Response) {
  const { title, content, banner, status } = req.body as BlogData;
  const userId = req.userId;
  const cleanContent = purify.sanitize(content);

  try {
    const newBlog = await Blog.create({
      title,
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
