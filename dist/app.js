"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = require("./lib/mongoose");
// import { errorHandler } from './middlewares/error.middleware';
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/api', routes_1.default);
// app.use(errorHandler); // middleware de errores
(0, mongoose_1.connectToMongo)(); // Carga mongoose
exports.default = app;
