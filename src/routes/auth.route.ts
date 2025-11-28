import { Router } from 'express';
import { registerValidator } from '@/utils/validators/auth.validator';

import { register } from '@/services/auth.service';

const router = Router();

router.post('/register', registerValidator, register);

export default router;
