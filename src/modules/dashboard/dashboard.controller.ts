import { Request, Response } from 'express';
import * as transactionService from '../transaction/transaction.service';
import * as dashboardService from './dashboard.service';

export const getTotalAmount = async (req: Request, res: Response) => {

    const totalAmount = await transactionService.getTransactionSummary();
    res.json(totalAmount);
};

export const getTransactionsBreakdown = async (req: Request, res: Response) => {
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
        let parsedMonth: number | undefined = undefined;
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
        } else {
            data = await transactionService.getMonthlyTransactions(parsedYear, parsedMonth);
        }

        res.json(data);
        return;  // <-- SOLO para cortar ejecución, NO retornes res.json
    } catch (error) {
        res.status(500).json({ message: 'Error fetching transactions breakdown', error });
        return;
    }
};

export const getTopCategories = async (req: Request, res: Response) => {
    try {
        const data = await transactionService.getTop5TransactionsWithOthers();
        res.json(data);
    } catch (error) {
        console.error('Error fetching top categories:', error);
        res.status(500).json({ message: 'Error fetching top categories', error });
    }
};

export const getSummaryV2 = async (req: Request, res: Response) => {
    try {
        const filters = dashboardService.parseDashboardFilters(req.query as any);
        const data = await dashboardService.getDashboardSummary(filters);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard summary v2', error });
    }
};

export const getCategoryBreakdownV2 = async (req: Request, res: Response) => {
    try {
        const filters = dashboardService.parseDashboardFilters(req.query as any);
        const data = await dashboardService.getCategoryBreakdown(filters);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category breakdown', error });
    }
};

export const getExpenseTrendV2 = async (req: Request, res: Response) => {
    try {
        const filters = dashboardService.parseDashboardFilters(req.query as any);
        const data = await dashboardService.getExpenseTrend(filters);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense trend', error });
    }
};

export const getRecentExpensesV2 = async (req: Request, res: Response) => {
    try {
        const filters = dashboardService.parseDashboardFilters(req.query as any);
        const data = await dashboardService.getRecentExpenses(filters);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent expenses', error });
    }
};
