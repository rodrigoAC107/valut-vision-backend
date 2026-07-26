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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const categoryService = __importStar(require("./category.service"));
const getCategories = async (req, res) => {
    const { type } = req.query;
    if (type && type !== 'expense' && type !== 'income') {
        res.status(400).json({ message: 'Invalid type query parameter' });
    }
    const filter = type ? { type: type } : {};
    const categories = await categoryService.getAllCategories(filter);
    res.json(categories);
};
exports.getCategories = getCategories;
const createCategory = async (req, res) => {
    if (!req.body.subcategories) {
        req.body.subcategories = [];
    }
    const newCategory = await categoryService.createCategory(req.body);
    res.status(201).json(newCategory);
};
exports.createCategory = createCategory;
const updateCategory = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        const updatedCategory = await categoryService.updateCategory(id, updateData);
        if (updatedCategory) {
            res.json(updatedCategory);
        }
        else {
            res.status(404).json({ message: 'Category not found' });
        }
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid data or update failed', error });
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (req, res) => {
    const { id } = req.params;
    const deleted = await categoryService.softDeleteCategory(id);
    res.json(deleted);
};
exports.deleteCategory = deleteCategory;
