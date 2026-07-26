"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_routes_1 = __importDefault(require("../modules/transaction/transaction.routes"));
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const user_route_1 = __importDefault(require("../modules/user/user.route"));
const category_route_1 = __importDefault(require("../modules/category/category.route"));
const dashboard_route_1 = __importDefault(require("../modules/dashboard/dashboard.route"));
const router = (0, express_1.Router)();
router.get('/ping', (req, res) => {
    res.json({ pong: true });
});
router.use('/transactions', transaction_routes_1.default);
router.use('/auth', auth_route_1.default);
router.use('/user', user_route_1.default);
router.use('/category', category_route_1.default);
router.use('/dashboard', dashboard_route_1.default);
exports.default = router;
