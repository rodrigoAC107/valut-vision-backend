import { Router } from 'express';
import * as userController from './user.controller';
import { requireAuth } from '../../middleware/requireAuth.middleware';

const router = Router();

router.post('/me', requireAuth, userController.me);
router.put('/update-password', requireAuth, userController.changePassword);

export default router;
