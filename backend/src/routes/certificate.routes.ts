import { Router } from 'express';
import { certificateController } from '@controllers/certificate.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { uploadImage } from '@middlewares/upload.middleware';
import { createCertificateSchema, updateCertificateSchema } from '@validations/certificate.validation';

const router = Router();

router.get('/', certificateController.list);
router.get('/:id', certificateController.getOne);
router.post(
  '/',
  requireAuth,
  requireAdmin,
  uploadImage.single('image'),
  validate(createCertificateSchema),
  certificateController.create
);
router.put('/:id', requireAuth, requireAdmin, validate(updateCertificateSchema), certificateController.update);
router.post(
  '/:id/image',
  requireAuth,
  requireAdmin,
  uploadImage.single('image'),
  certificateController.replaceImage
);
router.delete('/:id', requireAuth, requireAdmin, certificateController.remove);

export default router;
