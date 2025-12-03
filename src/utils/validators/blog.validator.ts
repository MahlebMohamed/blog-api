import { body, param, query } from 'express-validator';

import validationMiddleware from '@/middlewares/validator.middleware';

export const createBlogValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 150 })
    .withMessage('Title must be at most 150 characters long'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
  validationMiddleware,
];

export const getAllBlogsValidator = [
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

export const getBlogByUserIdValidator = [
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('User ID must be a valid Mongo ID'),
  ...getAllBlogsValidator,
  validationMiddleware,
];

export const getBlogBySlugValidator = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Slug is required')
    .isSlug()
    .withMessage('Slug must be a valid slug format'),
  validationMiddleware,
];

export const updateBlogValidator = [
  param('blogId')
    .notEmpty()
    .withMessage('Blog ID is required')
    .isMongoId()
    .withMessage('Blog ID must be a valid Mongo ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 150 })
    .withMessage('Title must be at most 150 characters long'),
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
  validationMiddleware,
];

export const deleteBlogValidator = [
  param('blogId')
    .notEmpty()
    .withMessage('Blog ID is required')
    .isMongoId()
    .withMessage('Blog ID must be a valid Mongo ID'),
  validationMiddleware,
];
