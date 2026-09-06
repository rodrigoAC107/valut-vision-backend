"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    description: { type: String },
    expenseType: { type: String, enum: ['fixed', 'variable'] },
    source: { type: String },
    sourceKey: { type: String },
    sourceCardId: { type: String },
    sourceCardName: { type: String },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
transactionSchema.index({ source: 1, sourceKey: 1 }, { unique: true, sparse: true });
exports.Transaction = (0, mongoose_1.model)('Transaction', transactionSchema);
