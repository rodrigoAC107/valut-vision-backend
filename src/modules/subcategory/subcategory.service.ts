import { SubCategoryInput, SubCategory } from '../category/category.model';

export const getAllSubCategories = async () => {
    return await SubCategory.find({ isDeleted: false }).lean();
};

export const createSubCategory = async (data: SubCategoryInput) => {
    const tx = new SubCategory(data);
    return await tx.save();
};

export const updateSubCategory = async (id: string, data: Partial<SubCategoryInput>) => {
    return await SubCategory.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const softDeleteSubCategory = async (id: string) => {
    return await SubCategory.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};