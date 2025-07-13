import { Category, CategoryInput } from "./category.model";

export const getAllCategories = async () => {
    return await Category.find({ isDeleted: false }).lean();
};

export const createCategory = async (data: CategoryInput) => {
    const tx = new Category(data);
    return await tx.save();
};

export const updateCategory = async (id: string, data: Partial<CategoryInput>) => {
    return await Category.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const softDeleteCategory = async (id: string) => {
    return await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};