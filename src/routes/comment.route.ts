import { Router } from 'express';

import authenticate from '@/middlewares/authenticate.middlewares';
import authorize from '@/middlewares/authorize.middlewares';
import {
  createComment,
  getCommentsByBlogId,
  updateComment,
  deleteComment,
} from '@/services/comment.service';
import {
  createCommentValidator,
  getCommentsByBlogIdValidator,
  updateCommentValidator,
  deleteCommentValidator,
} from '@/utils/validators/comment.validator';

const router = Router();

router
  .route('/blog/:blogId')
  .post(
    authenticate,
    authorize(['user', 'admin']),
    createCommentValidator,
    createComment,
  )
  .get(
    authenticate,
    authorize(['user', 'admin']),
    getCommentsByBlogIdValidator,
    getCommentsByBlogId,
  );

router
  .route('/blog/:commentId')
  .put(
    authenticate,
    authorize(['user', 'admin']),
    updateCommentValidator,
    updateComment,
  )
  .delete(
    authenticate,
    authorize(['user', 'admin']),
    deleteCommentValidator,
    deleteComment,
  );

export default router;
