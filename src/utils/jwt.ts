import config from '@/config';

import jwt from 'jsonwebtoken';

import { Types } from 'mongoose';

export function generateAccessToken(userId: Types.ObjectId): string {
  return jwt.sign({ userId }, config.JWT_ACCESS_SECRET as string, {
    expiresIn: config.ACCESS_TOKEN_EXPIRES,
    subject: 'accessApi',
  });
}

export function generateRefreshToken(userId: Types.ObjectId): string {
  return jwt.sign({ userId }, config.JWT_REFRESH_SECRET as string, {
    expiresIn: config.REFRESH_TOKEN_EXPIRES,
    subject: 'refreshToken',
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, config.JWT_ACCESS_SECRET as string);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, config.JWT_REFRESH_SECRET as string);
}
