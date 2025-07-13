import { Request, Response } from 'express';

import * as categoryService from './category.service';

export const getCategories = async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
};

export const createCategory = async (req: Request, res: Response) => {

    if (!req.body.subcategories) {
        req.body.subcategories = [];
    }

    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json(newCategory);
};

export const updateCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedCategory = await categoryService.updateCategory(id, updateData);
        if (updatedCategory) {
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data or update failed', error });
    }
};


export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await categoryService.softDeleteCategory(id);
    res.json(deleted);
};