import type { Router } from 'express';

import authRoutes from '@/routes/auth.route';
import blogRoutes from '@/routes/blog.route';
import likeRoutes from '@/routes/like.route';
import userRoutes from '@/routes/user.route';
import commentRoutes from '@/routes/comment.route';

function mountRoutes(app: Router): void {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/blogs', blogRoutes);
  app.use('/api/v1/likes', likeRoutes);
  app.use('/api/v1/comments', commentRoutes);
}

export default mountRoutes;
