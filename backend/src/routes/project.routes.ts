import { Router } from 'express';
import { projectController } from '@controllers/project.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { uploadImage } from '@middlewares/upload.middleware';
import { createProjectSchema, updateProjectSchema } from '@validations/project.validation';

const router = Router();

router.get('/', projectController.list);
router.get('/slug/:slug', projectController.getBySlug);
router.get('/:id', projectController.getOne);
router.post('/', requireAuth, requireAdmin, validate(createProjectSchema), projectController.create);
router.put('/:id', requireAuth, requireAdmin, validate(updateProjectSchema), projectController.update);
router.delete('/:id', requireAuth, requireAdmin, projectController.remove);

router.post(
  '/:id/thumbnail',
  requireAuth,
  requireAdmin,
  uploadImage.single('thumbnail'),
  projectController.uploadThumbnail
);
router.post(
  '/:id/images',
  requireAuth,
  requireAdmin,
  uploadImage.array('images', 10),
  projectController.uploadImages
);
router.delete('/:id/images', requireAuth, requireAdmin, projectController.removeImage);

export default router;
