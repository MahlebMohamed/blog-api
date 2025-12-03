import { param } from 'express-validator';

import validationMiddleware from '@/middlewares/validator.middleware';

export const likeBlogValidator = [
  param('blogId')
    .notEmpty()
    .withMessage('Blog ID is required')
    .isMongoId()
    .withMessage('Invalid blog ID'),
  validationMiddleware,
];

export const likeCommentValidator = [
  param('commentId')
    .notEmpty()
    .withMessage('Comment ID is required')
    .isMongoId()
    .withMessage('Invalid comment ID'),
  validationMiddleware,
];
