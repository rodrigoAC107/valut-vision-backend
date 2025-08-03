import { FilterQuery } from 'mongoose';
import { Transaction, TransactionDocument, TransactionInput } from "./transaction.model";

interface TransactionFilters {
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    type?: 'income' | 'expense';
}


export const getAllTransactions = async (filters: TransactionFilters = {}) => {
    const query: FilterQuery<TransactionDocument> = { isDeleted: false };

    if (filters.categoryId) {
        query.categoryId = filters.categoryId;
    }

    if (filters.type) {
        query.type = filters.type;
    }

    if (filters.startDate || filters.endDate) {
        query.createdAt = {};
        if (filters.startDate) {
            query.createdAt.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
            query.createdAt.$lte = new Date(filters.endDate);
        }
    }

    const transactions = await Transaction.find(query, { __v: 0 })
        .populate('categoryId', 'name'); // sin lean

    return transactions.map(tx => ({
        ...tx.toObject(),
        category: (tx.categoryId as any)?.name ?? null,
        categoryId: undefined,
    }));
};


export const getTransactionById = async (id: string) => {
    const tx = await Transaction.findById(id).populate('categoryId', 'name');
    if (!tx) return null;

    const txObj = tx.toObject();
    return {
        ...txObj,
        category: (txObj.categoryId as any)?.name ?? null,
        categoryId: tx.categoryId?._id ?? tx.categoryId,
    };
}

export const createTransaction = async (data: TransactionInput) => {
    const tx = new Transaction(data);
    return await tx.save();
};

export const updateTransaction = async (id: string, data: Partial<TransactionInput>) => {
    return await Transaction.findByIdAndUpdate(id, data, { new: true }).lean();
};

export const softDeleteTransaction = async (id: string) => {
    return await Transaction.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};
