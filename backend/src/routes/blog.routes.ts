import { Router } from 'express';
import { blogController } from '@controllers/blog.controller';
import { requireAuth, requireAdmin, optionalAuth } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { uploadImage } from '@middlewares/upload.middleware';
import { createBlogSchema, updateBlogSchema } from '@validations/blog.validation';

const router = Router();

router.get('/', optionalAuth, blogController.list);
router.get('/slug/:slug', blogController.getBySlug);
router.get('/:id', requireAuth, requireAdmin, blogController.getOne);
router.post('/', requireAuth, requireAdmin, validate(createBlogSchema), blogController.create);
router.put('/:id', requireAuth, requireAdmin, validate(updateBlogSchema), blogController.update);
router.post('/:id/cover', requireAuth, requireAdmin, uploadImage.single('cover'), blogController.uploadCover);
router.delete('/:id', requireAuth, requireAdmin, blogController.remove);

export default router;
