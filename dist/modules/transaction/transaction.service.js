"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTop5TransactionsWithOthers = exports.getMonthlyTransactions = exports.getTransactionSummary = exports.softDeleteTransaction = exports.updateTransaction = exports.createTransaction = exports.getTransactionById = exports.getAllTransactions = void 0;
const transaction_model_1 = require("./transaction.model");
const date_fns_1 = require("date-fns");
const parseDateOnly = (value, endOfDay = false) => {
    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) {
        return new Date(value);
    }
    return endOfDay
        ? new Date(year, month - 1, day, 23, 59, 59, 999)
        : new Date(year, month - 1, day, 0, 0, 0, 0);
};
const getAllTransactions = async (filters = {}) => {
    const query = { isDeleted: false };
    if (filters.categoryId) {
        query.categoryId = filters.categoryId;
    }
    if (filters.type) {
        query.type = filters.type;
    }
    if (filters.currentMonth) {
        const today = new Date();
        query.date = {
            $gte: (0, date_fns_1.startOfMonth)(today),
            $lte: (0, date_fns_1.endOfMonth)(today),
        };
    }
    else if (filters.startDate || filters.endDate) {
        query.date = {};
        if (filters.startDate) {
            query.date.$gte = parseDateOnly(filters.startDate);
        }
        if (filters.endDate) {
            query.date.$lte = parseDateOnly(filters.endDate, true);
        }
    }
    const transactions = await transaction_model_1.Transaction.find(query, { __v: 0 })
        .populate('categoryId', 'name') // sin lean
        .sort({ date: -1, createdAt: -1 })
        .limit(1000);
    return transactions.map((tx) => ({
        ...tx.toObject(),
        category: tx.categoryId?.name ?? null,
        categoryId: undefined,
    }));
};
exports.getAllTransactions = getAllTransactions;
const getTransactionById = async (id) => {
    const tx = await transaction_model_1.Transaction.findById(id).populate('categoryId', 'name');
    if (!tx)
        return null;
    const txObj = tx.toObject();
    return {
        ...txObj,
        category: txObj.categoryId?.name ?? null,
        categoryId: tx.categoryId?._id ?? tx.categoryId,
    };
};
exports.getTransactionById = getTransactionById;
const createTransaction = async (data) => {
    const tx = new transaction_model_1.Transaction(data);
    return await tx.save();
};
exports.createTransaction = createTransaction;
const updateTransaction = async (id, data) => {
    return await transaction_model_1.Transaction.findByIdAndUpdate(id, data, { new: true }).lean();
};
exports.updateTransaction = updateTransaction;
const softDeleteTransaction = async (id) => {
    return await transaction_model_1.Transaction.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};
exports.softDeleteTransaction = softDeleteTransaction;
const getTransactionSummary = async () => {
    // Rango del mes actual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    const result = await transaction_model_1.Transaction.aggregate([
        {
            $match: {
                isDeleted: false,
                date: { $gte: startOfMonth, $lt: endOfMonth }, // <-- filtro de mes actual
            },
        },
        {
            $facet: {
                totalExpenses: [
                    { $match: { type: 'expense' } },
                    { $group: { _id: null, total: { $sum: '$amount' } } },
                ],
                totalIncome: [
                    { $match: { type: 'income' } },
                    { $group: { _id: null, total: { $sum: '$amount' } } },
                ],
                topExpenseCategory: [
                    { $match: { type: 'expense' } },
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
                            total: 1,
                            categoryName: '$category.name',
                            lastDate: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                totalExpense: { $ifNull: [{ $arrayElemAt: ['$totalExpenses.total', 0] }, 0] },
                totalIncome: { $ifNull: [{ $arrayElemAt: ['$totalIncome.total', 0] }, 0] },
                topExpenseCategory: { $arrayElemAt: ['$topExpenseCategory', 0] },
            },
        },
    ]);
    return result[0];
};
exports.getTransactionSummary = getTransactionSummary;
const getMonthlyTransactions = async (year, month) => {
    const today = new Date();
    const targetYear = year ?? today.getFullYear();
    // 🎯 Caso: SÓLO año → agrupamos por mes
    if (year && !month) {
        const startDate = (0, date_fns_1.startOfYear)(new Date(targetYear, 0));
        const endDate = (0, date_fns_1.endOfYear)(startDate);
        // Traemos expense e income juntos
        const transactions = await transaction_model_1.Transaction.find({
            isDeleted: false,
            date: { $gte: startDate, $lte: endDate },
        });
        // Inicializamos arrays para cada tipo con 12 meses
        const monthlyExpenses = new Array(12).fill(0);
        const monthlyIncome = new Array(12).fill(0);
        for (const tx of transactions) {
            const monthIndex = (0, date_fns_1.getMonth)(tx.date); // 0-11
            if (tx.type === 'expense') {
                monthlyExpenses[monthIndex] += tx.amount;
            }
            else if (tx.type === 'income') {
                monthlyIncome[monthIndex] += tx.amount;
            }
        }
        return {
            expense: monthlyExpenses,
            income: monthlyIncome,
        };
    }
    // 🎯 Caso: año y mes → agrupamos por día
    const targetMonth = month ?? today.getMonth() + 1;
    const startDate = (0, date_fns_1.startOfMonth)(new Date(targetYear, targetMonth - 1));
    const endDate = (0, date_fns_1.endOfMonth)(startDate);
    const transactions = await transaction_model_1.Transaction.find({
        isDeleted: false,
        date: { $gte: startDate, $lte: endDate },
    });
    const totalDays = (0, date_fns_1.eachDayOfInterval)({ start: startDate, end: endDate }).length;
    const dailyIncome = new Array(totalDays).fill(0);
    const dailyExpense = new Array(totalDays).fill(0);
    for (const tx of transactions) {
        const day = (0, date_fns_1.getDate)(tx.date); // 1-based
        if (tx.type === 'income') {
            dailyIncome[day - 1] += tx.amount;
        }
        else if (tx.type === 'expense') {
            dailyExpense[day - 1] += tx.amount;
        }
    }
    return {
        income: dailyIncome,
        expense: dailyExpense,
    };
};
exports.getMonthlyTransactions = getMonthlyTransactions;
const getTop5TransactionsWithOthers = async () => {
    // Calcular inicio y fin del mes actual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    const result = await transaction_model_1.Transaction.aggregate([
        // Solo transacciones no eliminadas, de tipo gasto y del mes actual
        {
            $match: {
                isDeleted: false,
                type: 'expense',
                date: { $gte: startOfMonth, $lt: endOfMonth }, // <-- filtro de fechas
            },
        },
        // Unir con la colección Category
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category',
            },
        },
        { $unwind: '$category' },
        // Agrupar por categoría
        {
            $group: {
                _id: '$category.name',
                amount: { $sum: '$amount' },
            },
        },
        { $sort: { amount: -1 } },
        // Top 5 y otros
        {
            $facet: {
                top5: [{ $limit: 5 }],
                others: [
                    { $skip: 5 },
                    {
                        $group: {
                            _id: 'Otros',
                            amount: { $sum: '$amount' },
                        },
                    },
                ],
            },
        },
        {
            $project: {
                data: { $concatArrays: ['$top5', '$others'] },
            },
        },
        { $unwind: '$data' },
        {
            $project: {
                name: '$data._id',
                amount: '$data.amount',
            },
        },
    ]);
    return result;
};
exports.getTop5TransactionsWithOthers = getTop5TransactionsWithOthers;
