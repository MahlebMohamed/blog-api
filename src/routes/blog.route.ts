import { Router } from 'express';
import multer from 'multer';

import authenticate from '@/middlewares/authenticate.middlewares';
import authorize from '@/middlewares/authorize.middlewares';
import uploadBlogBanner from '@/middlewares/uploadImageBlogBanner.middleware';
import {
  createBlog,
  getAllBlogs,
  getBlogByUserId,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
} from '@/services/blog.service';
import {
  createBlogValidator,
  getAllBlogsValidator,
  getBlogByUserIdValidator,
  getBlogBySlugValidator,
  updateBlogValidator,
  deleteBlogValidator,
} from '@/utils/validators/blog.validator';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router
  .route('/')
  .get(
    authenticate,
    authorize(['user', 'admin']),
    getAllBlogsValidator,
    getAllBlogs,
  )
  .post(
    authenticate,
    authorize(['user', 'admin']),
    upload.single('banner_image'),
    createBlogValidator,
    uploadBlogBanner('post'),
    createBlog,
  );

router
  .route('/user/:userId')
  .get(
    authenticate,
    authorize(['user', 'admin']),
    getBlogByUserIdValidator,
    getBlogByUserId,
  );

router
  .route('/:slug')
  .get(
    authenticate,
    authorize(['user', 'admin']),
    getBlogBySlugValidator,
    getBlogBySlug,
  );

router
  .route('/:blogId')
  .put(
    authenticate,
    authorize(['user', 'admin']),
    upload.single('banner_image'),
    uploadBlogBanner('put'),
    updateBlogValidator,
    updateBlog,
  )
  .delete(
    authenticate,
    authorize(['user', 'admin']),
    deleteBlogValidator,
    deleteBlog,
  );

export default router;
