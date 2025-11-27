import { Request, Response } from 'express';

import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import User, { IUser } from '@/models/user.model';
import { getUsername } from '@/utils';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

async function register(req: Request, res: Response): Promise<void> {
  const { email, password, role } = req.body as UserData;

  try {
    const username = getUsername();
    const newUser = new User({
      username,
      email,
      password,
      role,
    });

    await newUser.save();

    const accessToken = generateAccessToken(newUser._id);
    const refreshToken = generateRefreshToken(newUser._id);

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

export default register;
