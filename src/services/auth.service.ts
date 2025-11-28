import { Request, Response } from 'express';

import config from '@/config';
import Token from '@/models/token.model';
import User, { IUser } from '@/models/user.model';
import { getUsername } from '@/utils/getFunction';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt';
import { logger } from '@/utils/winston';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, role } = req.body as UserData;

  if (role === 'admin' && !config.WHITELIST_ADMINS_MAIL.includes(email)) {
    res.status(403).json({
      code: 'AuthorizationError',
      message: 'You are not allowed to register as admin',
    });
  }

  try {
    const username = getUsername();
    const newUser = await User.create({
      username,
      email,
      password,
      role,
    });

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

    await Token.create({
      userId: newUser._id,
      token: refreshToken,
    });
    logger.info('Refresh token stored in database', { userId: newUser._id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      },
      accessToken,
      message: 'User registered successfully',
    });

    logger.info(`New user registered`, {
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });

    logger.error('Error in register controller', error);
  }
}
