import { FilterQuery } from 'mongoose';
import { Transaction, TransactionDocument, TransactionInput } from './transaction.model';
import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachMonthOfInterval,
  getDate,
  getMonth,
} from 'date-fns';

interface TransactionFilters {
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense';
  currentMonth?: boolean;
}

const parseDateOnly = (value: string, endOfDay = false) => {
  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return new Date(value);
  }

  return endOfDay
    ? new Date(year, month - 1, day, 23, 59, 59, 999)
    : new Date(year, month - 1, day, 0, 0, 0, 0);
};

export const getAllTransactions = async (filters: TransactionFilters = {}) => {
  const query: FilterQuery<TransactionDocument> = { isDeleted: false };

  if (filters.categoryId) {
    query.categoryId = filters.categoryId;
  }

  if (filters.type) {
    query.type = filters.type;
  }

  if (filters.currentMonth) {
    const today = new Date();
    query.date = {
      $gte: startOfMonth(today),
      $lte: endOfMonth(today),
    };
  } else if (filters.startDate || filters.endDate) {
    query.date = {};
    if (filters.startDate) {
      query.date.$gte = parseDateOnly(filters.startDate);
    }
    if (filters.endDate) {
      query.date.$lte = parseDateOnly(filters.endDate, true);
    }
  }

  const transactions = await Transaction.find(query, { __v: 0 })
    .populate('categoryId', 'name') // sin lean
    .sort({ date: -1, createdAt: -1 })
    .limit(1000);

  return transactions.map((tx) => ({
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
};

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
export const getTransactionSummary = async () => {
  // Rango del mes actual
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const result = await Transaction.aggregate([
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

export const getMonthlyTransactions = async (year?: number, month?: number) => {
  const today = new Date();
  const targetYear = year ?? today.getFullYear();

  // 🎯 Caso: SÓLO año → agrupamos por mes
  if (year && !month) {
    const startDate = startOfYear(new Date(targetYear, 0));
    const endDate = endOfYear(startDate);

    // Traemos expense e income juntos
    const transactions = await Transaction.find({
      isDeleted: false,
      date: { $gte: startDate, $lte: endDate },
    });

    // Inicializamos arrays para cada tipo con 12 meses
    const monthlyExpenses = new Array(12).fill(0);
    const monthlyIncome = new Array(12).fill(0);

    for (const tx of transactions) {
      const monthIndex = getMonth(tx.date); // 0-11

      if (tx.type === 'expense') {
        monthlyExpenses[monthIndex] += tx.amount;
      } else if (tx.type === 'income') {
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
  const startDate = startOfMonth(new Date(targetYear, targetMonth - 1));
  const endDate = endOfMonth(startDate);

  const transactions = await Transaction.find({
    isDeleted: false,
    date: { $gte: startDate, $lte: endDate },
  });

  const totalDays = eachDayOfInterval({ start: startDate, end: endDate }).length;

  const dailyIncome = new Array(totalDays).fill(0);
  const dailyExpense = new Array(totalDays).fill(0);

  for (const tx of transactions) {
    const day = getDate(tx.date); // 1-based
    if (tx.type === 'income') {
      dailyIncome[day - 1] += tx.amount;
    } else if (tx.type === 'expense') {
      dailyExpense[day - 1] += tx.amount;
    }
  }

  return {
    income: dailyIncome,
    expense: dailyExpense,
  };
};

export const getTop5TransactionsWithOthers = async () => {
  // Calcular inicio y fin del mes actual
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(startOfMonth);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const result = await Transaction.aggregate([
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
