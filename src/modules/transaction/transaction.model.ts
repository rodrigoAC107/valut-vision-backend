import { Schema, model, Document } from 'mongoose';

export type TransactionType = 'income' | 'expense';
export type ExpenseType = 'fixed' | 'variable';

export interface TransactionInput {
    amount: number;
    date: Date;
    categoryId: string;
    subcategoryId?: string;
    type: TransactionType;
    description?: string;
    expenseType?: ExpenseType;
}

export interface TransactionDocument extends TransactionInput, Document {
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema = new Schema<TransactionDocument>(
    {
        amount: { type: Number, required: true },
        date: { type: Date, required: true },
        categoryId: { type: String, required: true },
        subcategoryId: { type: String },
        type: { type: String, enum: ['income', 'expense'], required: true },
        description: { type: String },
        expenseType: { type: String, enum: ['fixed', 'variable'] },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export const Transaction = model<TransactionDocument>('Transaction', transactionSchema);
