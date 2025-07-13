import { Router } from 'express';

import * as categoryController from './category.controller';
import { requireAuth } from '../../middleware/requireAuth.middleware';

const router = Router();

router.get('/', requireAuth, categoryController.getCategories);
router.post('/', requireAuth, categoryController.createCategory);
router.put('/:id', requireAuth, categoryController.updateCategory);
router.delete('/:id', requireAuth, categoryController.deleteCategory);

export default router;
