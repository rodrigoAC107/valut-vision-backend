"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.softDeleteCategory = exports.updateCategory = exports.createCategory = exports.getAllCategories = void 0;
const category_model_1 = require("./category.model");
const getAllCategories = async (filter = {}) => {
    const query = { isDeleted: false };
    if (filter.type) {
        query.type = filter.type;
    }
    const categories = await category_model_1.Category.find(query, { __v: 0 }).lean();
    return categories;
};
exports.getAllCategories = getAllCategories;
const createCategory = async (data) => {
    const category = new category_model_1.Category(data);
    const savedCategory = await category.save();
    const obj = savedCategory.toObject();
    delete obj.__v;
    return obj;
};
exports.createCategory = createCategory;
const updateCategory = async (id, data) => {
    return await category_model_1.Category.findByIdAndUpdate(id, data, { new: true }).lean();
};
exports.updateCategory = updateCategory;
const softDeleteCategory = async (id) => {
    return await category_model_1.Category.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};
exports.softDeleteCategory = softDeleteCategory;
