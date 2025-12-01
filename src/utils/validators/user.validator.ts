import { body, cookie, param, query } from 'express-validator';

import validationMiddleware from '@/middlewares/validator.middleware';
import User from '@/models/user.model';

export const updateUserValidator = [
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .custom(async (value) => {
      const userExists = await User.exists({ username: value });
      if (userExists) {
        throw new Error('Username already in use');
      }
    }),
  body('email')
    .optional()
    .isEmail()
    .isLength({ max: 50 })
    .withMessage('Email must be at most 50 characters')
    .custom(async (value) => {
      const userExists = await User.exists({ email: value });
      if (userExists) {
        throw new Error('Username already in use');
      }
    }),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('firstName')
    .optional()
    .isLength({ max: 20 })
    .withMessage('First name cannot exceed 20 characters'),
  body('lastName')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Last name cannot exceed 20 characters'),
  body(['website', 'facebook', 'instagram', 'youtube', 'x', 'youtube'])
    .optional()
    .isURL()
    .withMessage('Must be a valid URL'),
  validationMiddleware,
];

export const getUsersValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be an integer between 1 and 50'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be an integer greater than 0'),
  validationMiddleware,
];

export const userIdValidator = [
  param('userId').notEmpty().isMongoId().withMessage('Invalid user ID'),
];
