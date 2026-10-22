import { Router } from 'express';
import { aboutController } from '@controllers/about.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { updateAboutSchema } from '@validations/about.validation';
import { uploadImage } from '@middlewares/upload.middleware';

const router = Router();

router.get('/', aboutController.get);
router.put('/', requireAuth, requireAdmin, validate(updateAboutSchema), aboutController.update);
router.post('/photo', requireAuth, requireAdmin, uploadImage.single('photo'), aboutController.updatePhoto);
router.post('/banner', requireAuth, requireAdmin, uploadImage.single('banner'), aboutController.updateBanner);

export default router;
