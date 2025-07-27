import { SubCategoryInput, SubCategory } from '../category/category.model';

export const getAllSubCategories = async () => {
    return await SubCategory.find({ isDeleted: false }, { __v: 0 }).lean();
};

export const createSubCategory = async (data: SubCategoryInput) => {
    const subCategory = new SubCategory(data);
    const savedSubCategory = await subCategory.save();

    const obj = savedSubCategory.toObject() as Partial<typeof subCategory>;
    delete obj.__v;

    return obj;
};

export const updateSubCategory = async (id: string, data: Partial<SubCategoryInput>) => {
    return await SubCategory.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const softDeleteSubCategory = async (id: string) => {
    return await SubCategory.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};