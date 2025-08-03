import { Schema, model, Document } from 'mongoose';

export type CategoryType = 'income' | 'expense';

export interface CategoryInput {
    name: string;
    type: CategoryType;
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
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export const Category = model<CategoryDocument>('Category', categorySchema);
