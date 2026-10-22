import { Router } from 'express';
import { testimonialController } from '@controllers/testimonial.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { uploadImage } from '@middlewares/upload.middleware';
import { createTestimonialSchema, updateTestimonialSchema } from '@validations/testimonial.validation';

const router = Router();

router.get('/', testimonialController.list);
router.get('/:id', testimonialController.getOne);
router.post('/', requireAuth, requireAdmin, validate(createTestimonialSchema), testimonialController.create);
router.put('/:id', requireAuth, requireAdmin, validate(updateTestimonialSchema), testimonialController.update);
router.post(
  '/:id/avatar',
  requireAuth,
  requireAdmin,
  uploadImage.single('avatar'),
  testimonialController.uploadAvatar
);
router.delete('/:id', requireAuth, requireAdmin, testimonialController.remove);

export default router;
