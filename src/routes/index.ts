import { Router } from 'express';

import TransactionRoutes from '../modules/transaction/transaction.routes';
import AuthRoutes from '../modules/auth/auth.route';
import UserRoutes from '../modules/user/user.route';

const router = Router();

router.use('/transactions', TransactionRoutes);
router.use('/auth', AuthRoutes);
router.use('/user', UserRoutes);

export default router;
