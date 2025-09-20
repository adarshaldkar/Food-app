import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MAILTRAP_API_TOKEN) {
    throw new Error('MAILTRAP_API_TOKEN is not configured in .env file');
}

export const client = new MailtrapClient({ 
    token: process.env.MAILTRAP_API_TOKEN
});

// Use a verified sender email from your Mailtrap account
export const sender = {
    email: "hello@demomailtrap.co",  // EXACTLY as shown in your Mailtrap dashboard
    name: "Food App"
};