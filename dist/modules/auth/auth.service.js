"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../user/user.model");
const JWT_SECRET = process.env.JWT_SECRET || 'pass-super-secret';
const registerUser = async (email, password, name) => {
    const existingUser = await user_model_1.User.findOne({ email });
    if (existingUser)
        throw new Error('Email already registered');
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const newUser = new user_model_1.User({
        email,
        password: hashedPassword,
        name,
    });
    await newUser.save();
    return newUser;
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        throw new Error('User not found');
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error('Password incorrect');
    const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1d' });
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;
    return { token, user: userObj };
};
exports.loginUser = loginUser;
