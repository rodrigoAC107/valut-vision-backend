// transaction.controller.ts

import { Request, Response } from 'express';
import * as transactionService from './transaction.service';

export const getTransactions = async (req: Request, res: Response) => {
    const filters = {
        categoryId: req.query.categoryId as string | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
        type: req.query.type as 'income' | 'expense' | undefined,
    };

    const transactions = await transactionService.getAllTransactions(filters);
    res.json(transactions);
};

export const getTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(id);
    if (transaction) res.json(transaction);
    else res.status(404).json({ message: 'Transaction not found' });
};

export const createTransaction = async (req: Request, res: Response) => {
    const newTransaction = await transactionService.createTransaction(req.body);
    res.status(201).json(newTransaction);
};

export const updateTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedTransaction = await transactionService.updateTransaction(id, updateData);
        if (updatedTransaction) {
            res.json(updatedTransaction);
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data or update failed', error });
    }
};


export const deleteTransaction = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deleted = await transactionService.softDeleteTransaction(id);
    res.json(deleted);
};
