import authenticate from '@/middlewares/authenticate.middlewares';
import authorize from '@/middlewares/authorize.middlewares';
import { Router } from 'express';

const router = Router();

router.get('/current', authenticate, authorize);

export default router;
