import { Schema, model, Document, Types } from 'mongoose';

export type TransactionType = 'income' | 'expense';
export type ExpenseType = 'fixed' | 'variable';

export interface TransactionInput {
    amount: number;
    date: Date;
    categoryId: Types.ObjectId;
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
        categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
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
