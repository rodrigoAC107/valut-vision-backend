"use strict";
// transaction.controller.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTransaction = exports.updateTransaction = exports.importFromTrello = exports.createTransaction = exports.getTransaction = exports.getTransactions = void 0;
const transactionService = __importStar(require("./transaction.service"));
const getTransactions = async (req, res) => {
    const filters = {
        categoryId: req.query.categoryId,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        type: req.query.type,
        currentMonth: req.query.currentMonth === 'true',
    };
    const transactions = await transactionService.getAllTransactions(filters);
    res.json(transactions);
};
exports.getTransactions = getTransactions;
const getTransaction = async (req, res) => {
    const { id } = req.params;
    const transaction = await transactionService.getTransactionById(id);
    if (transaction)
        res.json(transaction);
    else
        res.status(404).json({ message: 'Transaction not found' });
};
exports.getTransaction = getTransaction;
const createTransaction = async (req, res) => {
    const newTransaction = await transactionService.createTransaction(req.body);
    res.status(201).json(newTransaction);
};
exports.createTransaction = createTransaction;
const importFromTrello = async (req, res) => {
    const cardName = String(req.body.cardName || '').trim();
    if (!cardName) {
        res.status(400).json({ message: 'cardName is required' });
        return;
    }
    try {
        const result = await transactionService.importFromTrelloCard(cardName);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({
            message: error instanceof Error ? error.message : 'Error importing Trello card',
        });
    }
};
exports.importFromTrello = importFromTrello;
const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedTransaction = await transactionService.updateTransaction(id, updateData);
        if (updatedTransaction) {
            res.json(updatedTransaction);
        }
        else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid data or update failed', error });
    }
};
exports.updateTransaction = updateTransaction;
const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    const deleted = await transactionService.softDeleteTransaction(id);
    res.json(deleted);
};
exports.deleteTransaction = deleteTransaction;
