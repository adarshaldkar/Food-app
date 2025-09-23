import nodemailer from 'nodemailer';

// Create Gmail SMTP transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export const sendOwnerOTPEmailProduction = async (email: string, otpCode: string): Promise<void> => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email - Patel Food',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Email Verification</title>
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
                  <h1>Verify Your Email</h1>
              </div>
              <div class="content">
                  <h2>Hello,</h2>
                  <p>Thank you for registering with us. To complete your registration, please verify your email address by entering the following verification code:</p>
                  <div class="otp-code">${otpCode}</div>
                  <p>If you did not request this verification, please ignore this email.</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 The App. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Owner OTP email sent successfully via Gmail SMTP');
  } catch (error) {
    console.error('Gmail SMTP Error:', error);
    throw new Error(`Failed to send owner OTP email via Gmail: ${error}`);
  }
};

export const sendOwnerRequestVerificationEmailProduction = async (email: string, verificationLink: string): Promise<void> => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
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
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Owner request verification email sent successfully via Gmail SMTP');
  } catch (error) {
    console.error('Gmail SMTP Error:', error);
    throw new Error(`Failed to send owner request verification email via Gmail: ${error}`);
  }
};

export const sendVerificationEmailProduction = async (email: string, verificationToken: string): Promise<void> => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify your email - Patel Food',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Email Verification</title>
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
              .verification-code {
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
                  <h1>Verify Your Email</h1>
              </div>
              <div class="content">
                  <h2>Hello,</h2>
                  <p>Thank you for registering with us. To complete your registration, please verify your email address by entering the following verification code:</p>
                  <div class="verification-code">${verificationToken}</div>
                  <p>If you did not request this verification, please ignore this email.</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 The App. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully via Gmail SMTP');
  } catch (error) {
    console.error('Gmail SMTP Error:', error);
    throw new Error(`Failed to send verification email via Gmail: ${error}`);
  }
};

export const sendWelcomeEmailProduction = async (email: string, name: string): Promise<void> => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Patel Food!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Welcome</title>
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
                  background-color: #D19254;
                  color: white;
                  border-radius: 10px 10px 0 0;
              }
              .header h1 {
                  margin: 0;
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
                  <h1>Welcome to Our Platform!</h1>
              </div>
              <div class="content">
                  <h2>Hello ${name}!</h2>
                  <p>Welcome to our food delivery platform. We're excited to have you on board!</p>
                  <p>You can now browse restaurants, order your favorite meals, and enjoy fast delivery.</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 The App. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully via Gmail SMTP');
  } catch (error) {
    console.error('Gmail SMTP Error:', error);
    throw new Error(`Failed to send welcome email via Gmail: ${error}`);
  }
};

export const sendPasswordResetEmailProduction = async (email: string, resetURL: string): Promise<void> => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Password Reset</title>
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
                  <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                  <h2>Reset Your Password</h2>
                  <p>You have requested to reset your password. Click the button below to reset it:</p>
                  <a href="${resetURL}" class="button">Reset Password</a>
                  <p>If you did not request this password reset, please ignore this email.</p>
                  <p>This link will expire in 1 hour.</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 The App. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully via Gmail SMTP');
  } catch (error) {
    console.error('Gmail SMTP Error:', error);
    throw new Error(`Failed to send password reset email via Gmail: ${error}`);
  }
};

export const sendResetSuccessEmailProduction = async (email: string): Promise<void> => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Successful',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>Password Reset Successful</title>
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
                  background-color: #28a745;
                  color: white;
                  border-radius: 10px 10px 0 0;
              }
              .header h1 {
                  margin: 0;
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
                  <h1>Password Reset Successful</h1>
              </div>
              <div class="content">
                  <h2>Success!</h2>
                  <p>Your password has been successfully reset.</p>
                  <p>You can now log in with your new password.</p>
                  <p>If you did not make this change, please contact our support team immediately.</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 The App. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Password reset success email sent successfully via Gmail SMTP');
  } catch (error) {
    console.error('Gmail SMTP Error:', error);
    throw new Error(`Failed to send password reset success email via Gmail: ${error}`);
  }
};
