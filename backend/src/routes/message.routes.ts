import { Router } from 'express';
import { messageController } from '@controllers/message.controller';
import { requireAuth, requireAdmin } from '@middlewares/auth.middleware';
import { validate } from '@middlewares/validate.middleware';
import { contactLimiter } from '@middlewares/rateLimiter';
import { createMessageSchema } from '@validations/message.validation';

const router = Router();

router.post('/', contactLimiter, validate(createMessageSchema), messageController.create);
router.get('/', requireAuth, requireAdmin, messageController.list);
router.get('/unread-count', requireAuth, requireAdmin, messageController.unreadCount);
router.get('/:id', requireAuth, requireAdmin, messageController.getOne);
router.patch('/:id/read', requireAuth, requireAdmin, messageController.markAsRead);
router.delete('/:id', requireAuth, requireAdmin, messageController.remove);

export default router;
