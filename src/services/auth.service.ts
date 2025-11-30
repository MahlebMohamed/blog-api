import { Request, Response } from 'express';

import config from '@/config';
import Token from '@/models/token.model';
import User, { IUser } from '@/models/user.model';
import { getUsername } from '@/utils/getFunction';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt';
import { logger } from '@/utils/winston';
import { Types } from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

type UserDataRegister = Pick<IUser, 'email' | 'password' | 'role'>;
type UserDataLogin = Pick<IUser, 'email' | 'password'>;

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, role } = req.body as UserDataRegister;

  if (role === 'admin' && config.WHITELIST_ADMINS_MAIL.includes(email)) {
    res.status(403).json({
      code: 'AuthorizationError',
      message: 'You are not allowed to register as admin',
    });

    logger.warn('Unauthorized admin registration attempt', { email });
    return;
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

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as UserDataLogin;

  try {
    const user = await User.findOne({ email })
      .select('username email password role')
      .lean()
      .exec();

    if (!user) {
      res.status(401).json({
        code: 'NotFound',
        message: 'User not found',
      });
      return;
    }

    const accessToken = generateAccessToken(user!._id);
    const refreshToken = generateRefreshToken(user!._id);

    await Token.create({
      userId: user!._id,
      token: refreshToken,
    });
    logger.info('Refresh token stored in database', { userId: user!._id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      user: {
        username: user!.username,
        email: user!.email,
        role: user!.role,
      },
      accessToken,
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

export async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.cookies.refreshToken as string;

  try {
    const tokenExists = await Token.exists({ token: refreshToken });

    if (!tokenExists) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }

    const jwtPayload = verifyRefreshToken(refreshToken) as {
      userId: Types.ObjectId;
    };
    const newAccessToken = generateAccessToken(jwtPayload.userId);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Refresh token has expired',
      });
      return;
    }

    if (err instanceof JsonWebTokenError) {
      res.status(401).json({
        code: 'AuthenticationError',
        message: 'Invalid refresh token',
      });
      return;
    }

    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      err,
    });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken as string;
    if (refreshToken) {
      await Token.deleteOne({ token: refreshToken });

      logger.info('Refresh token deleted from database on logout', {
        userId: req.userId,
      });
    }

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.sendStatus(204);

    logger.info('User logged out successfully', { userId: req.userId });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });

    logger.error('Error in logout', error);
  }
}
