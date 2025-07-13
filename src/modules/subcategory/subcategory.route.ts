
import { Router } from 'express';
import * as subcategoryController from './subcategory.controller';

const router = Router();

router.get('/', subcategoryController.getSubCategories);
router.post('/', subcategoryController.createSubCategory);
router.put('/:id', subcategoryController.updateSubCategory);
router.delete('/:id', subcategoryController.deleteSubCategory);

export default router;
