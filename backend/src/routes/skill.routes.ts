import { Router } from 'express';
import { AppDataSource } from '@config/data-source';
import { Skill } from '@entities/Skill';
import { createCrudService } from '@services/generic.service';
import { createCrudController } from '@controllers/generic.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { createSkillSchema, updateSkillSchema } from '@validations/skill.validation';

const service = createCrudService<Skill>(AppDataSource.getRepository(Skill));
const controller = createCrudController<Skill>(service, 'Skill');

const router = Router();

router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.post('/', requireAuth, requireAdmin, validate(createSkillSchema), controller.create);
router.put('/:id', requireAuth, requireAdmin, validate(updateSkillSchema), controller.update);
router.delete('/:id', requireAuth, requireAdmin, controller.remove);

export default router;
