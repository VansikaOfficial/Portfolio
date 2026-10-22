import { Router } from 'express';
import { authController } from '@controllers/auth.controller';
import { validate } from '@middlewares/validate.middleware';
import { requireAuth } from '@middlewares/auth.middleware';
import { authLimiter } from '@middlewares/rateLimiter';
import { loginSchema, refreshTokenSchema, changePasswordSchema } from '@validations/auth.validation';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);
router.post('/logout', requireAuth, authController.logout);
router.get('/me', requireAuth, authController.me);
router.post('/change-password', requireAuth, validate(changePasswordSchema), authController.changePassword);

export default router;
