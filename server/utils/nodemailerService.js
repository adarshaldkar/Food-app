"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.sendSignupOTPEmail = exports.sendOwnerOTPEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create transporter using Gmail SMTP with better configuration
const createTransporter = () => {
    console.log('Creating Gmail transporter for:', process.env.EMAIL_USER);
    return nodemailer_1.default.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        },
        debug: true, // Enable debug logs
        logger: true // Enable logging
    });
};
// Fallback transporter using a different service (Ethereal for testing)
const createFallbackTransporter = () => __awaiter(void 0, void 0, void 0, function* () {
    // Create test account for development if Gmail fails
    const testAccount = yield nodemailer_1.default.createTestAccount();
    return nodemailer_1.default.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
});
const sendVerificationEmail = (email, verificationToken) => __awaiter(void 0, void 0, void 0, function* () {
    // Use fallback by default for development reliability
    const useProduction = process.env.USE_PRODUCTION_EMAIL === 'true';
    let transporter;
    if (useProduction) {
        transporter = createTransporter();
    }
    else {
        // Use reliable Ethereal for development
        transporter = yield createFallbackTransporter();
    }
    const mailOptions = {
        from: {
            name: 'Food App',
            address: process.env.EMAIL_USER || 'noreply@foodapp.com'
        },
        to: email,
        subject: 'Verify your email - Food App',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Verify Your Email</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 20px 0;
                        background: linear-gradient(135deg, #D19254, #d18c47);
                        border-radius: 10px 10px 0 0;
                        color: white;
                    }
                    .content {
                        padding: 30px 20px;
                        text-align: center;
                    }
                    .button {
                        display: inline-block;
                        padding: 15px 30px;
                        margin: 25px 0;
                        background-color: #D19254;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: bold;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 14px;
                        color: #999999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Food App!</h1>
                    </div>
                    <div class="content">
                        <h2>Please verify your email address</h2>
                        <p>Thank you for signing up! Please click the button below to verify your email address.</p>
                        <a href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}" class="button">
                            Verify Email
                        </a>
                        <p>This verification link will expire in 24 hours.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Food App. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    try {
        if (useProduction) {
            console.log('Attempting to send verification email via Gmail...');
        }
        else {
            console.log('Sending verification email via Ethereal (development mode)...');
        }
        const result = yield transporter.sendMail(mailOptions);
        if (useProduction) {
            console.log('Gmail email sent successfully:', result.messageId);
        }
        else {
            console.log('Ethereal email sent successfully:', result.messageId);
            console.log('Preview URL:', nodemailer_1.default.getTestMessageUrl(result));
        }
    }
    catch (error) {
        console.error('Email sending failed:', error.message);
        if (useProduction) {
            console.log('Gmail failed, trying fallback...');
            try {
                transporter = yield createFallbackTransporter();
                const result = yield transporter.sendMail(mailOptions);
                console.log('Fallback email sent successfully:', result.messageId);
                console.log('Preview URL:', nodemailer_1.default.getTestMessageUrl(result));
            }
            catch (fallbackError) {
                console.error('Both Gmail and fallback failed:', fallbackError.message);
                throw new Error(`Failed to send verification email: ${error.message}`);
            }
        }
        else {
            throw new Error(`Failed to send verification email: ${error.message}`);
        }
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
const sendOwnerOTPEmail = (email, otpCode) => __awaiter(void 0, void 0, void 0, function* () {
    // Use same approach as verification email
    const useProduction = process.env.USE_PRODUCTION_EMAIL === 'true';
    let transporter;
    if (useProduction) {
        transporter = createTransporter();
    }
    else {
        // Use reliable Ethereal for development
        transporter = yield createFallbackTransporter();
    }
    const mailOptions = {
        from: {
            name: 'Food App',
            address: process.env.EMAIL_USER || 'noreply@foodapp.com'
        },
        to: email,
        subject: 'Restaurant Owner Request - OTP Verification',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Owner Request OTP</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 20px 0;
                        background: linear-gradient(135deg, #D19254, #d18c47);
                        border-radius: 10px 10px 0 0;
                        color: white;
                    }
                    .content {
                        padding: 30px 20px;
                        text-align: center;
                    }
                    .otp-code {
                        display: inline-block;
                        font-size: 32px;
                        font-weight: bold;
                        color: #D19254;
                        margin: 20px 0;
                        padding: 15px 25px;
                        background-color: #f9f9f9;
                        border: 2px dashed #D19254;
                        border-radius: 10px;
                        letter-spacing: 5px;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 14px;
                        color: #999999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Restaurant Owner Request</h1>
                    </div>
                    <div class="content">
                        <h2>Email Verification Required</h2>
                        <p>Please enter the following OTP code to verify your email:</p>
                        <div class="otp-code">${otpCode}</div>
                        <p><strong>This OTP will expire in 10 minutes.</strong></p>
                        <p>If you didn't request this, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Food App. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    try {
        if (useProduction) {
            console.log('Attempting to send OTP email via Gmail...');
        }
        else {
            console.log('Sending OTP email via Ethereal (development mode)...');
        }
        const result = yield transporter.sendMail(mailOptions);
        if (useProduction) {
            console.log('Gmail OTP email sent successfully:', result.messageId);
        }
        else {
            console.log('Ethereal OTP email sent successfully:', result.messageId);
            console.log('Preview URL:', nodemailer_1.default.getTestMessageUrl(result));
        }
    }
    catch (error) {
        console.error('OTP email sending failed:', error.message);
        if (useProduction) {
            console.log('Gmail failed, trying fallback...');
            try {
                transporter = yield createFallbackTransporter();
                const result = yield transporter.sendMail(mailOptions);
                console.log('Fallback OTP email sent successfully:', result.messageId);
                console.log('Preview URL:', nodemailer_1.default.getTestMessageUrl(result));
            }
            catch (fallbackError) {
                console.error('Both Gmail and fallback failed:', fallbackError.message);
                throw new Error(`Failed to send OTP email: ${error.message}`);
            }
        }
        else {
            throw new Error(`Failed to send OTP email: ${error.message}`);
        }
    }
});
exports.sendOwnerOTPEmail = sendOwnerOTPEmail;
const sendSignupOTPEmail = (email, otpCode) => __awaiter(void 0, void 0, void 0, function* () {
    // Use same approach as verification email
    const useProduction = process.env.USE_PRODUCTION_EMAIL === 'true';
    let transporter;
    if (useProduction) {
        transporter = createTransporter();
    }
    else {
        // Use reliable Ethereal for development
        transporter = yield createFallbackTransporter();
    }
    const mailOptions = {
        from: {
            name: 'Food App',
            address: process.env.EMAIL_USER || 'noreply@foodapp.com'
        },
        to: email,
        subject: 'Verify Your Account - OTP Code',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Account Verification OTP</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 20px 0;
                        background: linear-gradient(135deg, #D19254, #d18c47);
                        border-radius: 10px 10px 0 0;
                        color: white;
                    }
                    .content {
                        padding: 30px 20px;
                        text-align: center;
                    }
                    .otp-code {
                        display: inline-block;
                        font-size: 32px;
                        font-weight: bold;
                        color: #D19254;
                        margin: 20px 0;
                        padding: 15px 25px;
                        background-color: #f9f9f9;
                        border: 2px dashed #D19254;
                        border-radius: 10px;
                        letter-spacing: 5px;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 14px;
                        color: #999999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to Food App!</h1>
                    </div>
                    <div class="content">
                        <h2>Verify Your Account</h2>
                        <p>Thank you for signing up! Please enter the following OTP code to verify your account:</p>
                        <div class="otp-code">${otpCode}</div>
                        <p><strong>This OTP will expire in 10 minutes.</strong></p>
                        <p>If you didn't create an account, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Food App. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    try {
        if (useProduction) {
            console.log('Attempting to send signup OTP email via Gmail...');
        }
        else {
            console.log('Sending signup OTP email via Ethereal (development mode)...');
        }
        const result = yield transporter.sendMail(mailOptions);
        if (useProduction) {
            console.log('Gmail signup OTP email sent successfully:', result.messageId);
        }
        else {
            console.log('Ethereal signup OTP email sent successfully:', result.messageId);
            console.log('Preview URL:', nodemailer_1.default.getTestMessageUrl(result));
        }
    }
    catch (error) {
        console.error('Signup OTP email sending failed:', error.message);
        if (useProduction) {
            console.log('Gmail failed, trying fallback...');
            try {
                transporter = yield createFallbackTransporter();
                const result = yield transporter.sendMail(mailOptions);
                console.log('Fallback signup OTP email sent successfully:', result.messageId);
                console.log('Preview URL:', nodemailer_1.default.getTestMessageUrl(result));
            }
            catch (fallbackError) {
                console.error('Both Gmail and fallback failed:', fallbackError.message);
                throw new Error(`Failed to send signup OTP email: ${error.message}`);
            }
        }
        else {
            throw new Error(`Failed to send signup OTP email: ${error.message}`);
        }
    }
});
exports.sendSignupOTPEmail = sendSignupOTPEmail;
const sendWelcomeEmail = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    let transporter = createTransporter();
    const mailOptions = {
        from: {
            name: 'Food App',
            address: process.env.EMAIL_USER || 'noreply@foodapp.com'
        },
        to: email,
        subject: 'Welcome to Food App! 🍽️',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Welcome to Food App</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        padding: 20px 0;
                        background: linear-gradient(135deg, #D19254, #d18c47);
                        border-radius: 10px 10px 0 0;
                        color: white;
                    }
                    .content {
                        padding: 30px 20px;
                        text-align: center;
                    }
                    .footer {
                        text-align: center;
                        padding: 20px;
                        font-size: 14px;
                        color: #999999;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome ${name}! 🎉</h1>
                    </div>
                    <div class="content">
                        <h2>Thanks for joining Food App!</h2>
                        <p>We're excited to have you on board. Start exploring delicious restaurants and amazing food!</p>
                        <p>Happy eating! 🍽️</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 Food App. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    try {
        console.log('Attempting to send welcome email via Gmail...');
        const result = yield transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully:', result.messageId);
    }
    catch (error) {
        console.error('Gmail failed for welcome email, trying fallback...', error.message);
        try {
            transporter = yield createFallbackTransporter();
            const result = yield transporter.sendMail(mailOptions);
            console.log('Welcome email sent via fallback (Ethereal):', result.messageId);
            console.log('Preview URL:', nodemailer_1.default.getTestMessageUrl(result));
        }
        catch (fallbackError) {
            console.error('Both Gmail and fallback failed:', fallbackError.message);
            throw new Error(`Failed to send welcome email: ${error.message}`);
        }
    }
});
exports.sendWelcomeEmail = sendWelcomeEmail;
