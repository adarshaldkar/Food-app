import nodemailer from 'nodemailer';
import { generateResetSuccessEmailHtml, generatePasswordResetEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";

// Create transporter for production email
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER, // Your Gmail address
            pass: process.env.EMAIL_PASSWORD, // Your Gmail App Password
        },
    });
};

export const sendVerificationEmailProduction = async (email: string, verificationToken: string): Promise<void> => {
    const transporter = createTransporter();
    
    try {
        console.log('Attempting to send verification email to:', email);
        
        const mailOptions = {
            from: {
                name: 'Food App',
                address: process.env.EMAIL_USER!
            },
            to: email,
            subject: 'Verify your email - Patel Food',
            html: htmlContent.replace("{verificationToken}", verificationToken)
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
    } catch (error: any) {
        console.error('Email Error Details:', error);
        throw new Error(`Failed to send email verification: ${error.message}`);
    }
};

export const sendWelcomeEmailProduction = async (email: string, name: string) => {
    const transporter = createTransporter();
    const htmlContent = generateWelcomeEmailHtml(name);
    
    try {
        const mailOptions = {
            from: {
                name: 'Food App',
                address: process.env.EMAIL_USER!
            },
            to: email,
            subject: 'Welcome to  Food App ! 🍽️',
            html: htmlContent
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully:', result.messageId);
    } catch (error: any) {
        console.error('Welcome email error:', error);
        throw new Error("Failed to send Welcome email");
    }
};

export const sendPasswordResetEmailProduction = async (email: string, resetURL: string) => {
    const transporter = createTransporter();
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    
    try {
        const mailOptions = {
            from: {
                name: 'Food App',
                address: process.env.EMAIL_USER!
            },
            to: email,
            subject: 'Reset Your Password - Patel Food',
            html: htmlContent
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully:', result.messageId);
    } catch (error: any) {
        console.error('Password reset email error:', error);
        throw new Error("Failed to send Reset email");
    }
};

export const sendResetSuccessEmailProduction = async (email: string) => {
    const transporter = createTransporter();
    const htmlContent = generateResetSuccessEmailHtml();
    
    try {
        const mailOptions = {
            from: {
                name: 'Food App',
                address: process.env.EMAIL_USER!
            },
            to: email,
            subject: 'Password Reset Successfully - Patel Food ✅',
            html: htmlContent
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Password reset success email sent successfully:', result.messageId);
    } catch (error: any) {
        console.error('Password reset success email error:', error);
        throw new Error("Failed to send password reset success email");
    }
};

export const sendOwnerOTPEmailProduction = async (email: string, otpCode: string): Promise<void> => {
    const transporter = createTransporter();
    
    try {
        console.log('Attempting to send owner OTP email to:', email);
        console.log('OTP Code:', otpCode);
        console.log('Email configuration:', {
            user: process.env.EMAIL_USER,
            hasPassword: !!process.env.EMAIL_PASSWORD
        });
        
        const mailOptions = {
            from: {
                name: 'Food App',
                address: process.env.EMAIL_USER!
            },
            to: email,
            subject: 'Verify Your Restaurant Owner Request - OTP - Patel Food',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Owner Request OTP Verification</title>
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
                        }
                        .header h1 {
                            margin: 0;
                            color: #333333;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content h2 {
                            color: #333333;
                        }
                        .content p {
                            color: #666666;
                            font-size: 16px;
                            line-height: 1.5;
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
                            <h1>Become a Restaurant Owner</h1>
                        </div>
                        <div class="content">
                            <h2>Hello,</h2>
                            <p>Thank you for your interest in becoming a restaurant owner on our platform.</p>
                            <p>To verify your email address and complete your owner request, please enter the following OTP code:</p>
                            <div class="otp-code">${otpCode}</div>
                            <p><strong>Important:</strong> Once you verify your email with this OTP, you'll automatically become an owner and can start managing your restaurant.</p>
                            <p>If you did not request to become a restaurant owner, please ignore this email.</p>
                            <p>This OTP will expire in 10 minutes.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Patel Food. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Owner OTP email sent successfully:', result.messageId);
    } catch (error: any) {
        console.error('Email Error Details:', error);
        throw new Error(`Failed to send owner OTP email: ${error.message}`);
    }
};

export const sendOwnerRequestVerificationEmailProduction = async (email: string, verificationLink: string): Promise<void> => {
    const transporter = createTransporter();
    
    try {
        console.log('Attempting to send owner request verification email to:', email);
        console.log('Verification link:', verificationLink);
        console.log('Email configuration:', {
            user: process.env.EMAIL_USER,
            hasPassword: !!process.env.EMAIL_PASSWORD
        });
        
        const mailOptions = {
            from: {
                name: 'Food App',
                address: process.env.EMAIL_USER!
            },
            to: email,
            subject: 'Verify Your Restaurant Owner Request - Patel Food',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Verify Restaurant Owner Request</title>
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
                        }
                        .header h1 {
                            margin: 0;
                            color: #333333;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content h2 {
                            color: #333333;
                        }
                        .content p {
                            color: #666666;
                            font-size: 16px;
                            line-height: 1.5;
                        }
                        .content .button {
                            display: inline-block;
                            padding: 12px 24px;
                            margin: 20px 0;
                            background-color: #D19254;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
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
                            <h1>Become a Restaurant Owner</h1>
                        </div>
                        <div class="content">
                            <h2>Hello,</h2>
                            <p>Thank you for your interest in becoming a restaurant owner on our platform.</p>
                            <p>To proceed with your request and become an owner, please verify your email address by clicking the button below:</p>
                            <a href="${verificationLink}" class="button">Verify Email Address</a>
                            <p><strong>Important:</strong> Once you verify your email, you'll automatically become an owner and can start managing your restaurant.</p>
                            <p>If you did not request to become a restaurant owner, please ignore this email.</p>
                            <p>This verification link will expire in 24 hours.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Patel Food. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        
        const result = await transporter.sendMail(mailOptions);
        console.log('Owner request verification email sent successfully:', result.messageId);
    } catch (error: any) {
        console.error('Email Error Details:', error);
        throw new Error(`Failed to send owner request verification email: ${error.message}`);
    }
};
