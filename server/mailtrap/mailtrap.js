"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sender = exports.client = void 0;
const mailtrap_1 = require("mailtrap");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.MAILTRAP_API_TOKEN) {
    throw new Error('MAILTRAP_API_TOKEN is not configured in .env file');
}
exports.client = new mailtrap_1.MailtrapClient({
    token: process.env.MAILTRAP_API_TOKEN
});
// Use a verified sender email from your Mailtrap account
exports.sender = {
    email: "hello@demomailtrap.co", // EXACTLY as shown in your Mailtrap dashboard
    name: "Food App"
};
