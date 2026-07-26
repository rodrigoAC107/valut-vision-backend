"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentExpenses = exports.getExpenseTrend = exports.getCategoryBreakdown = exports.getDashboardSummary = exports.parseDashboardFilters = void 0;
const date_fns_1 = require("date-fns");
const category_model_1 = require("../category/category.model");
const transaction_model_1 = require("../transaction/transaction.model");
const DEFAULT_COLORS = ['#003049', '#d62828', '#f77f00', '#fcbf49', '#669bbc', '#9c6644'];
const parseDashboardFilters = (query) => {
    const now = new Date();
    const year = Number.parseInt(query.year || `${now.getFullYear()}`, 10);
    const month = Number.parseInt(query.month || `${now.getMonth() + 1}`, 10);
    return {
        period: query.period === 'month' ? 'month' : 'year',
        year: Number.isNaN(year) ? now.getFullYear() : year,
        month: Number.isNaN(month) ? now.getMonth() + 1 : month,
    };
};
exports.parseDashboardFilters = parseDashboardFilters;
const getRange = (filters) => {
    if (filters.period === 'month') {
        const start = (0, date_fns_1.startOfMonth)(new Date(filters.year, filters.month - 1, 1));
        return { start, end: (0, date_fns_1.endOfMonth)(start) };
    }
    const start = (0, date_fns_1.startOfYear)(new Date(filters.year, 0, 1));
    return { start, end: (0, date_fns_1.endOfYear)(start) };
};
const getPreviousRange = (filters) => {
    if (filters.period === 'month') {
        const currentStart = (0, date_fns_1.startOfMonth)(new Date(filters.year, filters.month - 1, 1));
        const previousStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(currentStart, 1));
        return { start: previousStart, end: (0, date_fns_1.endOfMonth)(previousStart) };
    }
    const currentStart = (0, date_fns_1.startOfYear)(new Date(filters.year, 0, 1));
    const previousStart = (0, date_fns_1.startOfYear)((0, date_fns_1.subYears)(currentStart, 1));
    return { start: previousStart, end: (0, date_fns_1.endOfYear)(previousStart) };
};
const getSummaryTotals = async (start, end) => {
    const [totals, topCategory] = await Promise.all([
        transaction_model_1.Transaction.aggregate([
            { $match: { isDeleted: false, date: { $gte: start, $lte: end } } },
            { $group: { _id: '$type', total: { $sum: '$amount' } } },
        ]),
        transaction_model_1.Transaction.aggregate([
            { $match: { isDeleted: false, type: 'expense', date: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: '$categoryId',
                    total: { $sum: '$amount' },
                    lastDate: { $max: '$date' },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 1 },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'category',
                },
            },
            { $unwind: '$category' },
            {
                $project: {
                    _id: 0,
                    categoryId: '$_id',
                    categoryName: '$category.name',
                    total: 1,
                    lastDate: 1,
                },
            },
        ]),
    ]);
    return {
        totalIncome: totals.find((item) => item._id === 'income')?.total ?? 0,
        totalExpense: totals.find((item) => item._id === 'expense')?.total ?? 0,
        topExpenseCategory: topCategory[0] ?? {
            categoryId: '',
            categoryName: 'No category',
            total: 0,
            lastDate: null,
        },
    };
};
const getDashboardSummary = async (filters) => {
    const currentRange = getRange(filters);
    const previousRange = getPreviousRange(filters);
    const [currentSummary, previousSummary] = await Promise.all([
        getSummaryTotals(currentRange.start, currentRange.end),
        getSummaryTotals(previousRange.start, previousRange.end),
    ]);
    const previousTotalExpense = previousSummary.totalExpense;
    const amountDiff = currentSummary.totalExpense - previousTotalExpense;
    const percentage = previousTotalExpense === 0
        ? (currentSummary.totalExpense > 0 ? 100 : 0)
        : Number(((amountDiff / previousTotalExpense) * 100).toFixed(2));
    const today = new Date();
    const effectiveEnd = today < currentRange.end ? today : currentRange.end;
    const elapsedDays = Math.max((0, date_fns_1.differenceInCalendarDays)(effectiveEnd, currentRange.start) + 1, 1);
    return {
        ...currentSummary,
        netBalance: currentSummary.totalIncome - currentSummary.totalExpense,
        averageDailyExpense: Number((currentSummary.totalExpense / elapsedDays).toFixed(2)),
        expenseVsPreviousPeriod: {
            amount: amountDiff,
            percentage,
            trend: amountDiff > 0 ? 'up' : amountDiff < 0 ? 'down' : 'equal',
            previousTotalExpense,
        },
    };
};
exports.getDashboardSummary = getDashboardSummary;
const getCategoryBreakdown = async (filters) => {
    const { start, end } = getRange(filters);
    const [categories, expenses] = await Promise.all([
        category_model_1.Category.find({ isDeleted: false, type: 'expense' }, { __v: 0 }).lean(),
        transaction_model_1.Transaction.find({
            isDeleted: false,
            type: 'expense',
            date: { $gte: start, $lte: end },
        }).lean(),
    ]);
    const totalsByCategory = new Map();
    for (const expense of expenses) {
        const key = String(expense.categoryId);
        totalsByCategory.set(key, (totalsByCategory.get(key) ?? 0) + expense.amount);
    }
    const totalExpense = Array.from(totalsByCategory.values()).reduce((sum, amount) => sum + amount, 0);
    return categories
        .map((category, index) => {
        const amount = totalsByCategory.get(String(category._id)) ?? 0;
        const budget = category.monthlyBudget ?? null;
        const remaining = budget === null ? null : Number((budget - amount).toFixed(2));
        let status = 'no-budget';
        if (budget !== null) {
            if (amount > budget)
                status = 'over';
            else if (amount >= budget * 0.85)
                status = 'near';
            else
                status = 'under';
        }
        return {
            categoryId: String(category._id),
            name: category.name,
            amount,
            percentage: totalExpense === 0 ? 0 : Number(((amount / totalExpense) * 100).toFixed(2)),
            budget,
            remaining,
            status,
            color: DEFAULT_COLORS[index % DEFAULT_COLORS.length],
        };
    })
        .filter((item) => item.amount > 0 || item.budget !== null)
        .sort((a, b) => b.amount - a.amount);
};
exports.getCategoryBreakdown = getCategoryBreakdown;
const getExpenseTrend = async (filters) => {
    const { start, end } = getRange(filters);
    const expenses = await transaction_model_1.Transaction.find({
        isDeleted: false,
        type: 'expense',
        date: { $gte: start, $lte: end },
    }).lean();
    if (filters.period === 'month') {
        const labels = (0, date_fns_1.eachDayOfInterval)({ start, end }).map((day) => (0, date_fns_1.format)(day, 'd'));
        const values = new Array(labels.length).fill(0);
        for (const expense of expenses) {
            values[(0, date_fns_1.getDate)(expense.date) - 1] += expense.amount;
        }
        let cumulative = 0;
        return {
            labels,
            dailyExpense: values,
            cumulativeExpense: values.map((value) => {
                cumulative += value;
                return cumulative;
            }),
        };
    }
    const labels = (0, date_fns_1.eachMonthOfInterval)({ start, end }).map((month) => (0, date_fns_1.format)(month, 'MMM'));
    const values = new Array(labels.length).fill(0);
    for (const expense of expenses) {
        values[(0, date_fns_1.getMonth)(expense.date)] += expense.amount;
    }
    let cumulative = 0;
    return {
        labels,
        dailyExpense: values,
        cumulativeExpense: values.map((value) => {
            cumulative += value;
            return cumulative;
        }),
    };
};
exports.getExpenseTrend = getExpenseTrend;
const getRecentExpenses = async (filters) => {
    const { start, end } = getRange(filters);
    const expenses = await transaction_model_1.Transaction.find({
        isDeleted: false,
        type: 'expense',
        date: { $gte: start, $lte: end },
    })
        .populate('categoryId', 'name')
        .sort({ date: -1 })
        .limit(8);
    return expenses.map((expense) => ({
        id: String(expense._id),
        description: expense.description || 'Sin descripcion',
        amount: expense.amount,
        date: expense.date,
        category: expense.categoryId?.name ?? 'Sin categoria',
        expenseType: expense.expenseType ?? null,
    }));
};
exports.getRecentExpenses = getRecentExpenses;
