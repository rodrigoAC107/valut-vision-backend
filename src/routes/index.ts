import { Router } from 'express';

import TransactionRoutes from '../modules/transaction/transaction.routes';
import AuthRoutes from '../modules/auth/auth.route';

const router = Router();

router.use('/transactions', TransactionRoutes);
router.use('/auth', AuthRoutes);

export default router;
