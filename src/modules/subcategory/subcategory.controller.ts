import { Request, Response } from 'express';

import * as subcategoryService from './subcategory.service';

export const getSubCategories = async (req: Request, res: Response) => {
    const transactions = await subcategoryService.getAllSubCategories();
    res.json(transactions);
};

export const createSubCategory = async (req: Request, res: Response) => {
    const newSubCategory = await subcategoryService.createSubCategory(req.body);
    res.status(201).json(newSubCategory);
};

export const updateSubCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedSubCategory = await subcategoryService.updateSubCategory(id, updateData);
        if (updatedSubCategory) {
            res.json(updatedSubCategory);
        } else {
            res.status(404).json({ message: 'Sub Category not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data or update failed', error });
    }
};


export const deleteSubCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await subcategoryService.softDeleteSubCategory(id);
    res.json(deleted);
};