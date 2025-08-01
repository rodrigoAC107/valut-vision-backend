import { FilterQuery } from 'mongoose';
import { Transaction, TransactionDocument, TransactionInput } from "./transaction.model";

interface TransactionFilters {
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    type?: 'income' | 'expense';
}


// Obtener todas las transacciones que no están borradas
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

    return await Transaction.find(query, { __v: 0 }).lean();
};

// Obtener una transacción por ID
export const getTransactionById = async (id: string) => {
    return await Transaction.findById(id).lean();
};

// Crear una nueva transacción
export const createTransaction = async (data: TransactionInput) => {
    const tx = new Transaction(data);
    return await tx.save();
};

export const updateTransaction = async (id: string, data: Partial<TransactionInput>) => {
    return await Transaction.findByIdAndUpdate(id, data, { new: true }).lean();
};

// Borrado lógico (soft delete)
export const softDeleteTransaction = async (id: string) => {
    return await Transaction.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};
