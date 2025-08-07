import { Router } from 'express';

import * as dashboardController from './dashboard.controller';
import { requireAuth } from '../../middleware/requireAuth.middleware';

const router = Router();

router.get('/summary-amount', requireAuth, dashboardController.getTotalAmount);
router.get('/transactions-breakdown', requireAuth, dashboardController.getTransactionsBreakdown);
router.get('/top-categories', requireAuth, dashboardController.getTopCategories);

export default router;