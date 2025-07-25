import { Schema, model, Document } from 'mongoose';

export type CategoryType = 'income' | 'expense';

export interface SubCategoryInput {
    name: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface CategoryInput {
    name: string;
    type: CategoryType;
    subcategories?: SubCategoryInput[];
}

export interface CategoryDocument extends CategoryInput, Document {
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Subschema para Subcategory
const subcategorySchema = new Schema<SubCategoryInput>(
    {
        name: { type: String, required: true },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

// Esquema principal de Category
const categorySchema = new Schema<CategoryDocument>(
    {
        name: { type: String, required: true },
        type: { type: String, enum: ['income', 'expense'], required: true },
        subcategories: { type: [subcategorySchema], default: [] },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export const Category = model<CategoryDocument>('Category', categorySchema);

export const SubCategory = model<SubCategoryInput>('Subcategory', subcategorySchema);
