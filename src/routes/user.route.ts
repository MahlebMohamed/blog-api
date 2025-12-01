import { Router } from 'express';

import authenticate from '@/middlewares/authenticate.middlewares';
import authorize from '@/middlewares/authorize.middlewares';
import {
  deleteUser,
  deleteUserById,
  getUser,
  getUserById,
  getUsers,
  updateUser,
} from '@/services/user.service';
import {
  getUsersValidator,
  updateUserValidator,
  userIdValidator,
} from '@/utils/validators/user.validator';

const router = Router();

router.get(
  '/',
  authenticate,
  authorize(['admin']),
  getUsersValidator,
  getUsers,
);

router
  .route('/current')
  .get(authenticate, authorize(['user', 'admin']), getUser)
  .put(
    authenticate,
    authorize(['user', 'admin']),
    updateUserValidator,
    updateUser,
  )
  .delete(authenticate, authorize(['user', 'admin']), deleteUser);

router
  .route('/current/:userId')
  .get(authenticate, authorize(['admin']), userIdValidator, getUserById)
  .delete(authenticate, authorize(['admin']), userIdValidator, deleteUserById);

export default router;
