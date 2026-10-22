import { Router } from 'express';
import { AppDataSource } from '@config/data-source';
import { SocialLink } from '@entities/SocialLink';
import { createCrudService } from '@services/generic.service';
import { createCrudController } from '@controllers/generic.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { createSocialLinkSchema, updateSocialLinkSchema } from '@validations/socialLink.validation';

const service = createCrudService<SocialLink>(AppDataSource.getRepository(SocialLink));
const controller = createCrudController<SocialLink>(service, 'Social link');

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', requireAuth, requireAdmin, validate(createSocialLinkSchema), controller.create);
router.put('/:id', requireAuth, requireAdmin, validate(updateSocialLinkSchema), controller.update);
router.delete('/:id', requireAuth, requireAdmin, controller.remove);

export default router;
