import { Router } from 'express';

import authenticate from '@/middlewares/authenticate.middlewares';
import { login, logout, refreshToken, register } from '@/services/auth.service';
import {
  loginValidator,
  refreshTokenValidator,
  registerValidator,
} from '@/utils/validators/auth.validator';

const router = Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshTokenValidator, refreshToken);

export default router;
