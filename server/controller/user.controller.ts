import { Request, Response } from "express";
import { User } from "../models/user.model";
// import cors from 'cors'
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";
import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";
import {
  sendVerificationEmail,
  sendOwnerOTPEmail,
  sendSignupOTPEmail,
  sendWelcomeEmail,
} from "../utils/nodemailerService";

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("Signup request received:", req.body);
    const { fullName, email, password, contact } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !contact) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const signupOTPCode = generateVerificationCode();

    user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      contact: contact, // Fixed field name to match model
      signupOTP: signupOTPCode,
      signupOTPExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    });
    generateToken(res, user);

    try {
      await sendSignupOTPEmail(email, signupOTPCode);
      console.log("Signup OTP email sent successfully");
    } catch (emailError) {
      console.error("Error sending signup OTP email:", emailError);
    }

    const userWithoutPassword = await User.findOne({ email }).select(
      "-password"
    );
    return res.status(201).json({
      success: true,
      message: "Account created successfully. Please check your email for the OTP to verify your account.",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log('=== SIGNUP ERROR ===');
    console.log('Error details:', error);
    console.log('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.log('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: No user found with email ${email}`);
      const errorResponse = {
        success: false,
        message: "No account found with this email address. Please sign up first.",
      };
      console.log('Sending error response:', errorResponse);
      return res.status(401).json(errorResponse);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      console.log(`Login failed: Incorrect password for email ${email}`);
      const errorResponse = {
        success: false,
        message: "Incorrect password. Please check your credentials.",
      };
      console.log('Sending error response:', errorResponse);
      return res.status(401).json(errorResponse);
    }
    generateToken(res, user);
    
    // Fix legacy users who might have invalid contact field
    if (!user.contact || user.contact === 'NaN') {
      user.contact = '1234567890'; // Default contact number for legacy users
    }
    
    user.lastLogin = new Date();
    await user.save();

    // send user without passowrd
    const userWithoutPassword = await User.findOne({ email }).select(
      "-password"
    );
    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.fullName}`,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log('=== LOGIN SERVER ERROR ===');
    console.log(error);
    const errorResponse = { 
      success: false,
      message: "Internal server error" 
    };
    console.log('Sending server error response:', errorResponse);
    return res.status(500).json(errorResponse);
  }
};
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { verificationCode } = req.body;
    
    console.log('Legacy email verification request (for old verification tokens)');
    
    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    }).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token. Please use the new OTP verification system.",
      });
    }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    // send welcome email
    try {
      await sendWelcomeEmail(user.email, user.fullName);
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the verification if email fails
    }

    return res.status(200).json({
      success: true,
      message: "Email verified successfully (legacy method).",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = async (_: Request, res: Response): Promise<any> => {
  try {
    return res.clearCookie("token").status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist",
      });
    }

    const resetToken = crypto.randomBytes(40).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
    await user.save();

    // send email - temporarily disabled, replace with nodemailer
    // await sendPasswordResetEmail(
    //   user.email,
    //   `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    // );

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }
    //update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    // send success reset email - temporarily disabled, replace with nodemailer
    // await sendResetSuccessEmail(user.email);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const checkAuth = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log("CheckAuth endpoint hit");
    console.log("User ID from token:", req.id);
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    console.log("Found user:", user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const userId = req.id!;
    const { fullName, email, address, city, country, profilePicture } =
      req.body;
    // upload image on cloudinary
    let cloudResponse: any;
    try {
      if (profilePicture && profilePicture !== "Update your profile picture" && profilePicture.startsWith('data:')) {
        cloudResponse = await cloudinary.uploader.upload(profilePicture);
      }
    } catch (cloudinaryError) {
      console.error('Cloudinary upload error:', cloudinaryError);
      return res.status(500).json({ 
        success: false,
        message: "Failed to upload profile picture" 
      });
    }
    const updatedData = {
      fullName,
      email,
      address,
      city,
      country,
      ...(cloudResponse && { profilePicture: cloudResponse.secure_url }),
    };

    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");

    return res.status(200).json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Email verification for BecomeOwner page
export const sendEmailVerificationOTP = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    
    console.log('Received email verification OTP request for:', email);
    
    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    
    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }
    
    // Generate OTP
    const otpCode = generateVerificationCode();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    console.log('Generated OTP:', otpCode, 'for email:', email);
    
    // Find or create a temporary storage for OTP
    // We'll look for existing user or create a temporary record
    let user = await User.findOne({ email });
    if (user) {
      user.emailVerificationOTP = otpCode;
      user.emailVerificationOTPExpiresAt = otpExpiresAt;
      await user.save();
      console.log('Updated existing user with OTP');
    } else {
      // For now, we'll create a temporary user record or use session storage
      // Since this is for email verification only, we'll create a minimal user record
      user = new User({
        fullName: 'Temporary',
        email: email,
        password: 'temporary', // This will be updated when they actually sign up
        contact: '0000000000',
        emailVerificationOTP: otpCode,
        emailVerificationOTPExpiresAt: otpExpiresAt,
        emailVerified: false
      });
      await user.save();
      console.log('Created temporary user record for OTP verification');
    }
    
    // Send OTP email
    try {
      await sendOwnerOTPEmail(email, otpCode);
      console.log('Email verification OTP sent successfully to:', email);
    } catch (emailError) {
      console.error("Error sending email verification OTP:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again."
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "Verification OTP sent to your email successfully"
    });
  } catch (error) {
    console.error("Error in sendEmailVerificationOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const verifySignupOTP = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, otpCode } = req.body;
    
    console.log('Received signup OTP verification request for:', email, 'with OTP:', otpCode);
    
    // Validate required fields
    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP code are required"
      });
    }
    
    // Find user with this email and signup OTP
    const user = await User.findOne({
      email: email,
      signupOTP: otpCode
    });
    
    console.log('Found user for signup OTP verification:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code"
      });
    }
    
    // Check if the OTP has expired
    if (user.signupOTPExpiresAt && user.signupOTPExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one."
      });
    }
    
    // Mark user account as verified
    user.signupOTP = undefined;
    user.signupOTPExpiresAt = undefined;
    user.isVerified = true;
    await user.save();
    
    console.log('Signup verification successful for:', email);
    
    // Send welcome email after successful verification
    try {
      await sendWelcomeEmail(user.email, user.fullName);
      console.log('Welcome email sent after signup verification');
    } catch (emailError) {
      console.error('Error sending welcome email:', emailError);
      // Don't fail the verification if email fails
    }
    
    return res.status(200).json({
      success: true,
      message: "Account verified successfully! Welcome to Food App!",
      user: await User.findOne({ email }).select("-password")
    });
  } catch (error) {
    console.error("Error in verifySignupOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const resendSignupOTP = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email } = req.body;
    
    console.log('Resend signup OTP request for:', email);
    
    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No account found with this email address"
      });
    }
    
    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified"
      });
    }
    
    // Generate new OTP
    const signupOTPCode = generateVerificationCode();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    // Update user with new OTP
    user.signupOTP = signupOTPCode;
    user.signupOTPExpiresAt = otpExpiresAt;
    await user.save();
    
    console.log('Generated new signup OTP:', signupOTPCode, 'for email:', email);
    
    // Send OTP email
    try {
      await sendSignupOTPEmail(email, signupOTPCode);
      console.log('Resent signup OTP email successfully to:', email);
    } catch (emailError) {
      console.error("Error sending resend signup OTP email:", emailError);
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again."
      });
    }
    
    return res.status(200).json({
      success: true,
      message: "New verification OTP sent to your email successfully"
    });
  } catch (error) {
    console.error("Error in resendSignupOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const verifyEmailOTP = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { email, otpCode } = req.body;
    
    console.log('Received OTP verification request for:', email, 'with OTP:', otpCode);
    
    // Validate required fields
    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP code are required"
      });
    }
    
    // Find user with this email and OTP
    const user = await User.findOne({
      email: email,
      emailVerificationOTP: otpCode
    });
    
    console.log('Found user for OTP verification:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code"
      });
    }
    
    // Check if the OTP has expired
    if (user.emailVerificationOTPExpiresAt && user.emailVerificationOTPExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one."
      });
    }
    
    // Mark email as verified
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpiresAt = undefined;
    user.emailVerified = true;
    await user.save();
    
    console.log('Email verification successful for:', email);
    
    return res.status(200).json({
      success: true,
      message: "Email verified successfully!"
    });
  } catch (error) {
    console.error("Error in verifyEmailOTP:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
