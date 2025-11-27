import { Router } from 'express';

import register from '@/controllers/v1/auth/register.controller';

const router = Router();

router.post('/register', register);

export default router;
