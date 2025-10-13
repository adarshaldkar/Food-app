"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (res, user) => {
    const token = jsonwebtoken_1.default.sign({ userId: user._id.toString() }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: isProduction ? 'strict' : 'lax',
        secure: isProduction, // Only use secure in production
        maxAge: 24 * 60 * 60 * 1000,
        domain: isProduction ? undefined : 'localhost' // Set domain for localhost in dev
    });
    return token;
};
exports.generateToken = generateToken;
