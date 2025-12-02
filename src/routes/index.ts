import type { Router } from 'express';

import authRoutes from '@/routes/auth.route';
import userRoutes from '@/routes/user.route';
import blogRoutes from '@/routes/blog.route';

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
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/blog', userRoutes);
}

export default mountRoutes;
