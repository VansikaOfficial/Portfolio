import { Router } from 'express';
import { internshipController } from '@controllers/internship.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { uploadImage } from '@middlewares/upload.middleware';
import { createInternshipSchema, updateInternshipSchema } from '@validations/internship.validation';

const router = Router();

router.get('/', internshipController.list);
router.get('/:id', internshipController.getOne);
router.post('/', requireAuth, requireAdmin, validate(createInternshipSchema), internshipController.create);
router.put('/:id', requireAuth, requireAdmin, validate(updateInternshipSchema), internshipController.update);
router.post(
  '/:id/certificate',
  requireAuth,
  requireAdmin,
  uploadImage.single('certificate'),
  internshipController.uploadCertificate
);
router.delete('/:id', requireAuth, requireAdmin, internshipController.remove);

export default router;
