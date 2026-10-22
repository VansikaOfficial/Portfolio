import { Router } from 'express';
import { galleryController } from '@controllers/gallery.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { uploadImage } from '@middlewares/upload.middleware';
import { createGallerySchema, updateGallerySchema } from '@validations/gallery.validation';

const router = Router();

router.get('/', galleryController.list);
router.get('/:id', galleryController.getOne);
router.post(
  '/',
  requireAuth,
  requireAdmin,
  uploadImage.single('image'),
  validate(createGallerySchema),
  galleryController.create
);
router.put('/:id', requireAuth, requireAdmin, validate(updateGallerySchema), galleryController.update);
router.delete('/:id', requireAuth, requireAdmin, galleryController.remove);

export default router;
