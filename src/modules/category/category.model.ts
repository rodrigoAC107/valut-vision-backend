import { Schema, model, Document } from 'mongoose';

export type CategoryType = 'income' | 'expense';

export interface CategoryInput {
    name: string;
    type: CategoryType;
    monthlyBudget?: number | null;
}

export interface CategoryDocument extends CategoryInput, Document {
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema<CategoryDocument>(
    {
        name: { type: String, required: true },
        type: { type: String, enum: ['income', 'expense'], required: true },
        monthlyBudget: { type: Number, default: null },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export const Category = model<CategoryDocument>('Category', categorySchema);
