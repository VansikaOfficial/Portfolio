import { Router } from 'express';
import { resumeController } from '@controllers/resume.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { uploadDocument } from '@middlewares/upload.middleware';

const router = Router();

router.get('/', resumeController.get);
router.post('/', requireAuth, requireAdmin, uploadDocument.single('resume'), resumeController.upload);
router.delete('/', requireAuth, requireAdmin, resumeController.remove);

export default router;
