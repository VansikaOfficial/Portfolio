import { Router } from 'express';
import { settingController } from '@controllers/setting.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { uploadImage } from '@middlewares/upload.middleware';
import { updateSettingSchema } from '@validations/setting.validation';

const router = Router();

router.get('/', settingController.get);
router.put('/', requireAuth, requireAdmin, validate(updateSettingSchema), settingController.update);
router.post(
  '/favicon',
  requireAuth,
  requireAdmin,
  uploadImage.single('favicon'),
  settingController.updateFavicon
);
router.post(
  '/og-image',
  requireAuth,
  requireAdmin,
  uploadImage.single('ogImage'),
  settingController.updateOgImage
);

export default router;
