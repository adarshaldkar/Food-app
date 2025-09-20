import { client, sender } from "./mailtrap";
import { 
    sendVerificationEmailProduction, 
    sendWelcomeEmailProduction, 
    sendPasswordResetEmailProduction, 
    sendResetSuccessEmailProduction,
    sendOwnerRequestVerificationEmailProduction,
    sendOwnerOTPEmailProduction
} from "./productionEmail";
import {generateResetSuccessEmailHtml, generatePasswordResetEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";

// Environment flag to switch between Mailtrap (development) and Production email
const USE_PRODUCTION_EMAIL = process.env.NODE_ENV === 'production' || process.env.USE_PRODUCTION_EMAIL === 'true';

export const sendOwnerOTPEmail = async (email: string, otpCode: string): Promise<void> => {
    console.log(`Sending owner OTP email to: ${email} using ${USE_PRODUCTION_EMAIL ? 'Production' : 'Mailtrap'} email service`);
    console.log('OTP Code:', otpCode);
    
    if (USE_PRODUCTION_EMAIL) {
        console.log('Using production email service (Gmail SMTP)');
        return await sendOwnerOTPEmailProduction(email, otpCode);
    }
    
    // Mailtrap code for development/testing
    const recipient = [{ email }];
    try {
        console.log('Attempting to send owner OTP email via Mailtrap...');
        
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: 'Verify Your Restaurant Owner Request - OTP',
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
                            <p>&copy; 2024 The App. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            category: 'Owner Request OTP Verification',
            headers: {
                "X-MT-Category": "owner-otp-verification"
            }
        });
        
        console.log('Owner OTP email sent successfully via Mailtrap:', response);
    } catch (error: any) {
        console.error('Mailtrap Error Details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw new Error(`Failed to send owner OTP email: ${error.message}`);
    }
};

export const sendOwnerRequestVerificationEmail = async (email: string, verificationLink: string): Promise<void> => {
    console.log(`Sending owner request verification email to: ${email} using ${USE_PRODUCTION_EMAIL ? 'Production' : 'Mailtrap'} email service`);
    console.log('Verification link:', verificationLink);
    
    if (USE_PRODUCTION_EMAIL) {
        console.log('Using production email service (Gmail SMTP)');
        return await sendOwnerRequestVerificationEmailProduction(email, verificationLink);
    }
    
    // Original Mailtrap code for development/testing
    const recipient = [{ email }];
    try {
        console.log('Attempting to send owner request verification email via Mailtrap...');
        
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: 'Verify Your Restaurant Owner Request',
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
                            <p>&copy; 2024 The App. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            category: 'Owner Request Verification',
            headers: {
                "X-MT-Category": "owner-request-verification"
            }
        });
        
        console.log('Owner request verification email sent successfully via Mailtrap:', response);
    } catch (error: any) {
        console.error('Mailtrap Error Details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw new Error(`Failed to send owner request verification email: ${error.message}`);
    }
};

export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<void> => {
    console.log(`Sending verification email to: ${email} using ${USE_PRODUCTION_EMAIL ? 'Production' : 'Mailtrap'} email service`);
    
    if (USE_PRODUCTION_EMAIL) {
        return await sendVerificationEmailProduction(email, verificationToken);
    }
    
    // Original Mailtrap code for development/testing
    const recipient = [{ email }];
    try {
        console.log('Attempting to send verification email via Mailtrap...');
        
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: 'Verify your email',
            html: htmlContent.replace("{verificationToken}", verificationToken),
            category: 'Email Verification',
            headers: {
                "X-MT-Category": "verification"
            }
        });
        
        console.log('Email sent successfully via Mailtrap:', response);
    } catch (error: any) {
        console.error('Mailtrap Error Details:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw new Error(`Failed to send email verification: ${error.message}`);
    }
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  console.log(`Sending welcome email to: ${email} using ${USE_PRODUCTION_EMAIL ? 'Production' : 'Mailtrap'} email service`);
  
  if (USE_PRODUCTION_EMAIL) {
    return await sendWelcomeEmailProduction(email, name);
  }
  
  // Original Mailtrap code for development/testing
  const recipient = [{ email }];
  const htmlContent = generateWelcomeEmailHtml(name);
  try {
    await client.send({
      from: sender,
      to: recipient,
      subject: "Welcome to my APP",
      html: htmlContent,
      template_variables: {
        company_info_name: "App",
        name: name,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send Welcome email");
  }
};

export const sendPasswordResetEmail = async (email: string, resetURL: string) => {
  console.log(`Sending password reset email to: ${email} using ${USE_PRODUCTION_EMAIL ? 'Production' : 'Mailtrap'} email service`);
  
  if (USE_PRODUCTION_EMAIL) {
    return await sendPasswordResetEmailProduction(email, resetURL);
  }
  
  // Original Mailtrap code for development/testing
  const recipient = [{ email }];
  const htmlContent = generatePasswordResetEmailHtml(resetURL);
  try {
    await client.send({
      from: sender,
      to: recipient,
      subject: "Reset Your Password",
      html: htmlContent,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send Reset email");
  }
};

export const sendResetSuccessEmail = async (email:string) => {
  console.log(`Sending password reset success email to: ${email} using ${USE_PRODUCTION_EMAIL ? 'Production' : 'Mailtrap'} email service`);
  
  if (USE_PRODUCTION_EMAIL) {
    return await sendResetSuccessEmailProduction(email);
  }
  
  // Original Mailtrap code for development/testing
  const recipient = [{ email }];
  const htmlContent = generateResetSuccessEmailHtml();
  try {
    await client.send({
      from: sender,
      to: recipient,
      subject: 'Password Reset Successfully',
      html:htmlContent,
      category:"Password Reset"
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to send password reset success email");
  }
}

export const sendOwnerApprovalEmail = async (email: string, name: string): Promise<void> => {
    console.log(`Sending owner approval congratulations email to: ${email} using ${USE_PRODUCTION_EMAIL ? 'Production' : 'Mailtrap'} email service`);
    
    // For now, we'll use Mailtrap format. Later we can add production email if needed.
    const recipient = [{ email }];
    try {
        const response = await client.send({
            from: sender,
            to: recipient,
            subject: '🎉 Congratulations! You are now a Restaurant Owner!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Owner Request Approved</title>
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
                        .header h1 {
                            margin: 0;
                            font-size: 28px;
                        }
                        .celebration {
                            font-size: 60px;
                            margin: 10px 0;
                        }
                        .content {
                            padding: 30px 20px;
                            text-align: center;
                        }
                        .content h2 {
                            color: #333333;
                            margin-bottom: 20px;
                        }
                        .content p {
                            color: #666666;
                            font-size: 16px;
                            line-height: 1.6;
                            margin-bottom: 15px;
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
                            font-size: 16px;
                            transition: background-color 0.3s;
                        }
                        .features {
                            background-color: #f9f9f9;
                            padding: 20px;
                            border-radius: 8px;
                            margin: 25px 0;
                        }
                        .features h3 {
                            color: #333333;
                            margin-bottom: 15px;
                        }
                        .features ul {
                            text-align: left;
                            color: #666666;
                        }
                        .features li {
                            margin-bottom: 8px;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 14px;
                            color: #999999;
                            border-top: 1px solid #eeeeee;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="celebration">🎉</div>
                            <h1>Congratulations ${name}!</h1>
                            <p>Your restaurant owner request has been approved!</p>
                        </div>
                        <div class="content">
                            <h2>Welcome to the Restaurant Owner Community!</h2>
                            <p>We're excited to inform you that your request to become a restaurant owner has been <strong>approved</strong> by our admin team.</p>
                            <p>You now have access to the restaurant management dashboard where you can:</p>
                            
                            <div class="features">
                                <h3>🍽️ What you can do now:</h3>
                                <ul>
                                    <li>✅ Create and manage your restaurant profile</li>
                                    <li>✅ Add and update your menu items</li>
                                    <li>✅ Manage incoming orders</li>
                                    <li>✅ Track your restaurant's performance</li>
                                    <li>✅ Update order statuses for customers</li>
                                    <li>✅ Reach thousands of potential customers</li>
                                </ul>
                            </div>
                            
                            <p>Ready to get started? Click the button below to access your dashboard:</p>
                            <a href="http://localhost:5173/admin/restaurant" class="button">Go to Dashboard</a>
                            
                            <p><strong>Need help?</strong> Our support team is here to assist you in setting up your restaurant and getting the most out of our platform.</p>
                            
                            <p>Thank you for choosing to partner with us. We look forward to your success!</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2025 Food App. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply to this message.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            category: 'Owner Approval Notification',
            headers: {
                "X-MT-Category": "owner-approval"
            }
        });
        
        console.log('Owner approval email sent successfully:', response);
    } catch (error: any) {
        console.error('Error sending owner approval email:', error);
        throw new Error(`Failed to send owner approval email: ${error.message}`);
    }
};




// import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
// import { client, sender } from "./mailtrap";

// export const sendVerificationEmail = async (email: string, verificationToken: string) => {
//     const recipient = [{ email }];
//     try {
//         const res = await client.send({
//             from: sender,
//             to: recipient,
//             subject: 'Verify your email',
//             html:htmlContent.replace("{verificationToken}", verificationToken),
//             category: 'Email Verification'
//         });
//     } catch (error) {
//         console.log(error);
//         throw new Error("Failed to send email verification")

//     }
// }
// export const sendWelcomeEmail = async (email: string, name: string) => {
//     const recipient = [{ email }];
//     const htmlContent = generateWelcomeEmailHtml(name);
//     try {
//         const res = await client.send({
//             from: sender,
//             to: recipient,
//             subject: 'Welcome to PatelEats',
//             html:htmlContent,
//             template_variables:{
//                 company_info_name:"PatelEats",
//                 name:name
//             }
//         });
//     } catch (error) {
//         console.log(error);
//         throw new Error("Failed to send welcome email")
//     }
// }
// export const sendPasswordResetEmail = async (email:string, resetURL:string) => {
//     const recipient = [{ email }];
//     const htmlContent = generatePasswordResetEmailHtml(resetURL);
//     try {
//         const res = await client.send({
//             from: sender,
//             to: recipient,
//             subject: 'Reset your password',
//             html:htmlContent,
//             category:"Reset Password"
//         });
//     } catch (error) {
//         console.log(error);
//         throw new Error("Failed to reset password")
//     }
// }
// export const sendResetSuccessEmail = async (email:string) => {
//     const recipient = [{ email }];
//     const htmlContent = generateResetSuccessEmailHtml();
//     try {
//         const res = await client.send({
//             from: sender,
//             to: recipient,
//             subject: 'Password Reset Successfully',
//             html:htmlContent,
//             category:"Password Reset"
//         });
//     } catch (error) {
//         console.log(error);
//         throw new Error("Failed to send password reset success email");
//     }
// }