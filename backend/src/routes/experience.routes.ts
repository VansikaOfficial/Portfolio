import { Router } from 'express';
import { AppDataSource } from '@config/data-source';
import { Experience } from '@entities/Experience';
import { createCrudService } from '@services/generic.service';
import { createCrudController } from '@controllers/generic.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { createExperienceSchema, updateExperienceSchema } from '@validations/experience.validation';

const service = createCrudService<Experience>(AppDataSource.getRepository(Experience));
const controller = createCrudController<Experience>(service, 'Experience');

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', requireAuth, requireAdmin, validate(createExperienceSchema), controller.create);
router.put('/:id', requireAuth, requireAdmin, validate(updateExperienceSchema), controller.update);
router.delete('/:id', requireAuth, requireAdmin, controller.remove);

export default router;
