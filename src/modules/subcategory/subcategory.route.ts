import { Router } from 'express';

import * as subcategoryController from './subcategory.controller';
import { requireAuth } from '../../middleware/requireAuth.middleware';

const router = Router();

router.get('/', requireAuth, subcategoryController.getSubCategories);
router.post('/', requireAuth, subcategoryController.createSubCategory);
router.put('/:id', requireAuth, subcategoryController.updateSubCategory);
router.delete('/:id', requireAuth, subcategoryController.deleteSubCategory);

export default router;
