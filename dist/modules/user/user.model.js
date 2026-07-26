"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// models/user.model.ts
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Encriptada
    name: { type: String, required: true },
});
exports.User = (0, mongoose_1.model)('User', userSchema);
