import { body, param, query } from 'express-validator';

import validationMiddleware from '@/middlewares/validator.middleware';

export const createCommentValidator = [
  param('blogId')
    .notEmpty()
    .withMessage('Blog ID is required')
    .isMongoId()
    .withMessage('Invalid blog ID'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 500 })
    .withMessage('Content cannot exceed 500 characters'),
  validationMiddleware,
];

export const getCommentsByBlogIdValidator = [
  param('blogId')
    .notEmpty()
    .withMessage('Blog ID is required')
    .isMongoId()
    .withMessage('Invalid blog ID'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be an integer between 1 and 100'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be an integer greater than 0'),
  validationMiddleware,
];

export const updateCommentValidator = [
  param('commentId')
    .notEmpty()
    .withMessage('Comment ID is required')
    .isMongoId()
    .withMessage('Invalid comment ID'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ max: 500 })
    .withMessage('Content cannot exceed 500 characters'),
  validationMiddleware,
];

export const deleteCommentValidator = [
  param('commentId')
    .notEmpty()
    .withMessage('Comment ID is required')
    .isMongoId()
    .withMessage('Invalid comment ID'),
  validationMiddleware,
];
