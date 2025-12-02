import { Router } from 'express';
import multer from 'multer';

import authenticate from '@/middlewares/authenticate.middlewares';
import authorize from '@/middlewares/authorize.middlewares';
import { createBlog } from '@/services/blog.service';

const router = Router();
const upload = multer();

router
  .route('/')
  .post(
    authenticate,
    authorize(['user', 'admin']),
    upload.single('banner_image'),
    createBlog,
  );

export default router;
