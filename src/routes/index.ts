import { Router } from 'express';

import TransactionRoutes from '../modules/transaction/transaction.routes';
import AuthRoutes from '../modules/auth/auth.route';
import UserRoutes from '../modules/user/user.route';
import CategoryRoutes from '../modules/category/category.route';
import SubCategoryRoutes from '../modules/subcategory/subcategory.route';

const router = Router();

router.use('/transactions', TransactionRoutes);
router.use('/auth', AuthRoutes);
router.use('/user', UserRoutes);
router.use('/category', CategoryRoutes);
router.use('/subcategory', SubCategoryRoutes);

export default router;
