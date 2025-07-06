// transaction.routes.ts

import { Router } from 'express';
import * as transactionController from './transaction.controller';

const router = Router();

router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransaction);
router.post('/', transactionController.createTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

export default router;
