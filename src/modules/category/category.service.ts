import { Category, CategoryInput } from './category.model';

export interface CategoryFilter {
    type?: 'income' | 'expense';
}

export const getAllCategories = async (filter: CategoryFilter = {}) => {
    const query: any = { isDeleted: false };

    if (filter.type) {
        query.type = filter.type;
    }

    const categories = await Category.find(query, { __v: 0 }).lean();

    return categories;
};


export const createCategory = async (data: CategoryInput) => {
    const category = new Category(data);
    const savedCategory = await category.save();

    const obj = savedCategory.toObject() as Partial<typeof category>;
    delete obj.__v;

    return obj;
};

export const updateCategory = async (id: string, data: Partial<CategoryInput>) => {
    return await Category.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const softDeleteCategory = async (id: string) => {
    return await Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};