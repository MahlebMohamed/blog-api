import type { Router } from 'express';

import authRoutes from '@/routes/auth.route';
import blogRoutes from '@/routes/blog.route';
import userRoutes from '@/routes/user.route';

function mountRoutes(app: Router): void {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/blogs', blogRoutes);
}

export default mountRoutes;
