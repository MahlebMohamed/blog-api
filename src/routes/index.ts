import type { Router } from 'express';

import authRoutes from '@/routes/auth.route';

// router.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'API is live',
//     status: 'ok',
//     version: '1.0.0',
//     timestamp: new Date().toISOString(),
//   });
// });

// router.use('/auth', authRoutes);

function mountRoutes(app: Router): void {
  app.use('/api/v1/auth', authRoutes);
}

export default mountRoutes;
