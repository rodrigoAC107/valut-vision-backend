"use strict";
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
exports.getRecentExpensesV2 = exports.getExpenseTrendV2 = exports.getCategoryBreakdownV2 = exports.getSummaryV2 = exports.getTopCategories = exports.getTransactionsBreakdown = exports.getTotalAmount = void 0;
const transactionService = __importStar(require("../transaction/transaction.service"));
const dashboardService = __importStar(require("./dashboard.service"));
const getTotalAmount = async (req, res) => {
    const totalAmount = await transactionService.getTransactionSummary();
    res.json(totalAmount);
};
exports.getTotalAmount = getTotalAmount;
const getTransactionsBreakdown = async (req, res) => {
    try {
        const { year, month } = req.query;
        // Validar año
        if (!year || typeof year !== 'string') {
            res.status(400).json({ message: 'Year parameter is required and must be a string' });
            return;
        }
        const parsedYear = parseInt(year, 10);
        if (isNaN(parsedYear)) {
            res.status(400).json({ message: 'Year parameter must be a valid number' });
            return;
        }
        // Validar mes si viene
        let parsedMonth = undefined;
        if (month !== undefined) {
            if (typeof month !== 'string') {
                res.status(400).json({ message: 'Month parameter must be a string' });
                return;
            }
            parsedMonth = parseInt(month, 10);
            if (isNaN(parsedMonth) || parsedMonth < 1 || parsedMonth > 12) {
                res.status(400).json({ message: 'Month parameter must be a valid month number (1-12)' });
                return;
            }
        }
        // Lógica
        let data;
        if (parsedMonth === undefined) {
            data = await transactionService.getMonthlyTransactions(parsedYear);
        }
        else {
            data = await transactionService.getMonthlyTransactions(parsedYear, parsedMonth);
        }
        res.json(data);
        return; // <-- SOLO para cortar ejecución, NO retornes res.json
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching transactions breakdown', error });
        return;
    }
};
exports.getTransactionsBreakdown = getTransactionsBreakdown;
const getTopCategories = async (req, res) => {
    try {
        const data = await transactionService.getTop5TransactionsWithOthers();
        res.json(data);
    }
    catch (error) {
        console.error('Error fetching top categories:', error);
        res.status(500).json({ message: 'Error fetching top categories', error });
    }
};
exports.getTopCategories = getTopCategories;
const getSummaryV2 = async (req, res) => {
    try {
        const filters = dashboardService.parseDashboardFilters(req.query);
        const data = await dashboardService.getDashboardSummary(filters);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard summary v2', error });
    }
};
exports.getSummaryV2 = getSummaryV2;
const getCategoryBreakdownV2 = async (req, res) => {
    try {
        const filters = dashboardService.parseDashboardFilters(req.query);
        const data = await dashboardService.getCategoryBreakdown(filters);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching category breakdown', error });
    }
};
exports.getCategoryBreakdownV2 = getCategoryBreakdownV2;
const getExpenseTrendV2 = async (req, res) => {
    try {
        const filters = dashboardService.parseDashboardFilters(req.query);
        const data = await dashboardService.getExpenseTrend(filters);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching expense trend', error });
    }
};
exports.getExpenseTrendV2 = getExpenseTrendV2;
const getRecentExpensesV2 = async (req, res) => {
    try {
        const filters = dashboardService.parseDashboardFilters(req.query);
        const data = await dashboardService.getRecentExpenses(filters);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching recent expenses', error });
    }
};
exports.getRecentExpensesV2 = getRecentExpensesV2;
