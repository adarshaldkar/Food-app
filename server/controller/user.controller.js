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
exports.verifyEmailOTP = exports.resendSignupOTP = exports.verifySignupOTP = exports.sendEmailVerificationOTP = exports.updateProfile = exports.checkAuth = exports.resetPassword = exports.forgotPassword = exports.logout = exports.verifyEmail = exports.login = exports.signup = void 0;
const user_model_1 = require("../models/user.model");
// import cors from 'cors'
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const generateVerificationCode_1 = require("../utils/generateVerificationCode");
const generateToken_1 = require("../utils/generateToken");
const nodemailerService_1 = require("../utils/nodemailerService");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let user = yield user_model_1.User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exist with this email",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const signupOTPCode = (0, generateVerificationCode_1.generateVerificationCode)();
        user = yield user_model_1.User.create({
            fullName,
            email,
            password: hashedPassword,
            contact: contact, // Fixed field name to match model
            signupOTP: signupOTPCode,
            signupOTPExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
        });
        (0, generateToken_1.generateToken)(res, user);
        try {
            yield (0, nodemailerService_1.sendSignupOTPEmail)(email, signupOTPCode);
            console.log("Signup OTP email sent successfully");
        }
        catch (emailError) {
            console.error("Error sending signup OTP email:", emailError);
        }
        const userWithoutPassword = yield user_model_1.User.findOne({ email }).select("-password");
        return res.status(201).json({
            success: true,
            message: "Account created successfully. Please check your email for the OTP to verify your account.",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            console.log(`Login failed: No user found with email ${email}`);
            const errorResponse = {
                success: false,
                message: "No account found with this email address. Please sign up first.",
            };
            console.log('Sending error response:', errorResponse);
            return res.status(401).json(errorResponse);
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log(`Login failed: Incorrect password for email ${email}`);
            const errorResponse = {
                success: false,
                message: "Incorrect password. Please check your credentials.",
            };
            console.log('Sending error response:', errorResponse);
            return res.status(401).json(errorResponse);
        }
        (0, generateToken_1.generateToken)(res, user);
        // Fix legacy users who might have invalid contact field
        if (!user.contact || user.contact === 'NaN') {
            user.contact = '1234567890'; // Default contact number for legacy users
        }
        user.lastLogin = new Date();
        yield user.save();
        // send user without passowrd
        const userWithoutPassword = yield user_model_1.User.findOne({ email }).select("-password");
        return res.status(200).json({
            success: true,
            message: `Welcome back ${user.fullName}`,
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.log('=== LOGIN SERVER ERROR ===');
        console.log(error);
        const errorResponse = {
            success: false,
            message: "Internal server error"
        };
        console.log('Sending server error response:', errorResponse);
        return res.status(500).json(errorResponse);
    }
});
exports.login = login;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { verificationCode } = req.body;
        console.log('Legacy email verification request (for old verification tokens)');
        const user = yield user_model_1.User.findOne({
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
        yield user.save();
        // send welcome email
        try {
            yield (0, nodemailerService_1.sendWelcomeEmail)(user.email, user.fullName);
        }
        catch (emailError) {
            console.error('Error sending welcome email:', emailError);
            // Don't fail the verification if email fails
        }
        return res.status(200).json({
            success: true,
            message: "Email verified successfully (legacy method).",
            user,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.verifyEmail = verifyEmail;
const logout = (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.logout = logout;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist",
            });
        }
        const resetToken = crypto_1.default.randomBytes(40).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        yield user.save();
        // send email - temporarily disabled, replace with nodemailer
        // await sendPasswordResetEmail(
        //   user.email,
        //   `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
        // );
        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = yield user_model_1.User.findOne({
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
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        yield user.save();
        // send success reset email - temporarily disabled, replace with nodemailer
        // await sendResetSuccessEmail(user.email);
        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.resetPassword = resetPassword;
const checkAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("CheckAuth endpoint hit");
        console.log("User ID from token:", req.id);
        const userId = req.id;
        const user = yield user_model_1.User.findById(userId).select("-password");
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.checkAuth = checkAuth;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { fullName, email, address, city, country, profilePicture } = req.body;
        // upload image on cloudinary
        let cloudResponse;
        try {
            if (profilePicture && profilePicture !== "Update your profile picture" && profilePicture.startsWith('data:')) {
                cloudResponse = yield cloudinary_1.default.uploader.upload(profilePicture);
            }
        }
        catch (cloudinaryError) {
            console.error('Cloudinary upload error:', cloudinaryError);
            return res.status(500).json({
                success: false,
                message: "Failed to upload profile picture"
            });
        }
        const updatedData = Object.assign({ fullName,
            email,
            address,
            city,
            country }, (cloudResponse && { profilePicture: cloudResponse.secure_url }));
        const user = yield user_model_1.User.findByIdAndUpdate(userId, updatedData, {
            new: true,
        }).select("-password");
        return res.status(200).json({
            success: true,
            user,
            message: "Profile updated successfully",
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateProfile = updateProfile;
// Email verification for BecomeOwner page
const sendEmailVerificationOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const otpCode = (0, generateVerificationCode_1.generateVerificationCode)();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        console.log('Generated OTP:', otpCode, 'for email:', email);
        // Find or create a temporary storage for OTP
        // We'll look for existing user or create a temporary record
        let user = yield user_model_1.User.findOne({ email });
        if (user) {
            user.emailVerificationOTP = otpCode;
            user.emailVerificationOTPExpiresAt = otpExpiresAt;
            yield user.save();
            console.log('Updated existing user with OTP');
        }
        else {
            // For now, we'll create a temporary user record or use session storage
            // Since this is for email verification only, we'll create a minimal user record
            user = new user_model_1.User({
                fullName: 'Temporary',
                email: email,
                password: 'temporary', // This will be updated when they actually sign up
                contact: '0000000000',
                emailVerificationOTP: otpCode,
                emailVerificationOTPExpiresAt: otpExpiresAt,
                emailVerified: false
            });
            yield user.save();
            console.log('Created temporary user record for OTP verification');
        }
        // Send OTP email
        try {
            yield (0, nodemailerService_1.sendOwnerOTPEmail)(email, otpCode);
            console.log('Email verification OTP sent successfully to:', email);
        }
        catch (emailError) {
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
    }
    catch (error) {
        console.error("Error in sendEmailVerificationOTP:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.sendEmailVerificationOTP = sendEmailVerificationOTP;
const verifySignupOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield user_model_1.User.findOne({
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
        yield user.save();
        console.log('Signup verification successful for:', email);
        // Send welcome email after successful verification
        try {
            yield (0, nodemailerService_1.sendWelcomeEmail)(user.email, user.fullName);
            console.log('Welcome email sent after signup verification');
        }
        catch (emailError) {
            console.error('Error sending welcome email:', emailError);
            // Don't fail the verification if email fails
        }
        return res.status(200).json({
            success: true,
            message: "Account verified successfully! Welcome to Food App!",
            user: yield user_model_1.User.findOne({ email }).select("-password")
        });
    }
    catch (error) {
        console.error("Error in verifySignupOTP:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.verifySignupOTP = verifySignupOTP;
const resendSignupOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield user_model_1.User.findOne({ email });
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
        const signupOTPCode = (0, generateVerificationCode_1.generateVerificationCode)();
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        // Update user with new OTP
        user.signupOTP = signupOTPCode;
        user.signupOTPExpiresAt = otpExpiresAt;
        yield user.save();
        console.log('Generated new signup OTP:', signupOTPCode, 'for email:', email);
        // Send OTP email
        try {
            yield (0, nodemailerService_1.sendSignupOTPEmail)(email, signupOTPCode);
            console.log('Resent signup OTP email successfully to:', email);
        }
        catch (emailError) {
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
    }
    catch (error) {
        console.error("Error in resendSignupOTP:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.resendSignupOTP = resendSignupOTP;
const verifyEmailOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const user = yield user_model_1.User.findOne({
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
        yield user.save();
        console.log('Email verification successful for:', email);
        return res.status(200).json({
            success: true,
            message: "Email verified successfully!"
        });
    }
    catch (error) {
        console.error("Error in verifyEmailOTP:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.verifyEmailOTP = verifyEmailOTP;
