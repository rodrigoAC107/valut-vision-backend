import { Router } from 'express';

import * as transactionController from './transaction.controller';
import { requireAuth } from '../../middleware/requireAuth.middleware';

const router = Router();

router.get('/', requireAuth, transactionController.getTransactions);
router.get('/:id', requireAuth, transactionController.getTransaction);
router.post('/', requireAuth, transactionController.createTransaction);
router.put('/:id', requireAuth, transactionController.updateTransaction);
router.delete('/:id', requireAuth, transactionController.deleteTransaction);

export default router;
