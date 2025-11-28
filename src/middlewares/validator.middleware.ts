import { validationResult } from 'express-validator';

import type { NextFunction, Request, Response } from 'express';

export default function validationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ code: 'ValidationError', errors: errors.mapped() });
  }

  next();
}
