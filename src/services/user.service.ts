import User from '@/models/user.model';
import { logger } from '@/utils/winston';
import type { Request, Response } from 'express';

export async function getUser(req: Request, res: Response) {
  const userId = req.userId;

  try {
    const user = await User.findById(userId).select('-_v').lean().exec();

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

export async function getUsers(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 8;
    const skip = (page - 1) * limit;

    const users = await User.find({}).skip(skip).limit(limit).select('-_v');

    return res.status(200).json({ page, result: users.length, data: users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const newUser = await User.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    });

    logger.info(`User ${newUser?.username} updated successfully`);
    res.status(200).json({ newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    await User.findByIdAndDelete(req.userId);

    logger.info(`A user account has been deleted successfullyn`, req.userId);
    res.sendStatus(204).json('User deleted successfully');
  } catch (error) {
    res
      .status(500)
      .json({ code: 'ServerError', message: 'Server error', error });

    logger.error('Error deleting user', { error });
  }
}

export async function getUserById(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('-_v').lean().exec();

    if (!user) {
      res.status(404).json({ code: 'NotFound', message: 'User not found' });
      return;
    }
    res.status(200).json({
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}

export async function deleteUserById(
  req: Request,
  res: Response,
): Promise<void> {
  const { userId } = req.params;

  try {
    await User.findByIdAndDelete(userId);

    logger.info(`A user account has been deleted successfullyn`, req.userId);
    res.sendStatus(204).json('User deleted successfully');
  } catch (error) {
    res
      .status(500)
      .json({ code: 'ServerError', message: 'Server error', error });

    logger.error('Error deleting user', { error });
  }
}
