"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.me = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("./user.model");
const me = async (email) => {
    const userData = await user_model_1.User.findOne({ email });
    if (!userData)
        throw new Error('User not found');
    return userData;
};
exports.me = me;
const updatePassword = async (email, password, newPassword, confirmPassword) => {
    if (newPassword !== confirmPassword) {
        throw new Error('New password and confirmation do not match');
    }
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new Error('User not found');
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error('Current password incorrect');
    const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    return user;
};
exports.updatePassword = updatePassword;
