import { Router } from 'express';

import authenticate from '@/middlewares/authenticate.middlewares';
import authorize from '@/middlewares/authorize.middlewares';
import {
  likeBlog,
  unlikeBlog,
  likeComment,
  unlikeComment,
} from '@/services/like.service';
import {
  likeBlogValidator,
  likeCommentValidator,
} from '@/utils/validators/like.validator';

const router = Router();

router
  .route('/blog/:blogId')
  .post(authenticate, authorize(['user', 'admin']), likeBlogValidator, likeBlog)
  .delete(
    authenticate,
    authorize(['user', 'admin']),
    likeBlogValidator,
    unlikeBlog,
  );

router
  .route('/comment/:commentId')
  .post(
    authenticate,
    authorize(['user', 'admin']),
    likeCommentValidator,
    likeComment,
  )
  .delete(
    authenticate,
    authorize(['user', 'admin']),
    likeCommentValidator,
    unlikeComment,
  );

export default router;
