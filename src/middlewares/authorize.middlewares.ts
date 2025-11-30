import type { NextFunction, Request, Response } from 'express';

import User from '@/models/user.model';
import { logger } from '@/utils/winston';

export type AuthRole = 'user' | 'admin';

export default function authorize(roles: AuthRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('role').exec();
      if (!user) {
        res.status(401).json({
          code: 'NotFound',
          message: 'User not found',
        });
        return;
      }

      if (!roles.includes(user.role as AuthRole)) {
        res.status(403).json({
          code: 'Forbidden',
          message: 'You do not have permission to access this resource',
        });
        return;
      }

      return next();
    } catch (error) {
      res.status(500).json({
        code: 'ServerError',
        message: 'Internal server error',
        error,
      });
      logger.error('Error in authorize middleware', error);
    }
  };
}
