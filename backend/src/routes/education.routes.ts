import { Router } from 'express';
import { AppDataSource } from '@config/data-source';
import { Education } from '@entities/Education';
import { createCrudService } from '@services/generic.service';
import { createCrudController } from '@controllers/generic.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { createEducationSchema, updateEducationSchema } from '@validations/education.validation';

const service = createCrudService<Education>(AppDataSource.getRepository(Education));
const controller = createCrudController<Education>(service, 'Education');

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', requireAuth, requireAdmin, validate(createEducationSchema), controller.create);
router.put('/:id', requireAuth, requireAdmin, validate(updateEducationSchema), controller.update);
router.delete('/:id', requireAuth, requireAdmin, controller.remove);

export default router;
