import { Router } from 'express';

import * as dashboardController from './dashboard.controller';
import { requireAuth } from '../../middleware/requireAuth.middleware';

const router = Router();

router.get('/summary-amount', requireAuth, dashboardController.getTotalAmount);
router.get('/transactions-breakdown', requireAuth, dashboardController.getTransactionsBreakdown);
router.get('/top-categories', requireAuth, dashboardController.getTopCategories);
router.get('/v2/summary', requireAuth, dashboardController.getSummaryV2);
router.get('/v2/category-breakdown', requireAuth, dashboardController.getCategoryBreakdownV2);
router.get('/v2/expense-trend', requireAuth, dashboardController.getExpenseTrendV2);
router.get('/v2/recent-expenses', requireAuth, dashboardController.getRecentExpensesV2);

export default router;
