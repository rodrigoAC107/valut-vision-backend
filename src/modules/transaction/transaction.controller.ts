// transaction.controller.ts

import { Request, Response } from 'express';
import * as transactionService from './transaction.service';

export const getTransactions = async (req: Request, res: Response) => {
    const filters = {
        categoryId: req.query.categoryId as string | undefined,
        startDate: req.query.startDate as string | undefined,
        endDate: req.query.endDate as string | undefined,
        type: req.query.type as 'income' | 'expense' | undefined,
        currentMonth: req.query.currentMonth === 'true',
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

export const importFromTrello = async (req: Request, res: Response) => {
    const cardName = String(req.body.cardName || '').trim();

    if (!cardName) {
        res.status(400).json({ message: 'cardName is required' });
        return;
    }

    try {
        const result = await transactionService.importFromTrelloCard(cardName);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Error importing Trello card',
        });
    }
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
