"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOwnerRequest = exports.updateOwnerRequestStatus = exports.getOwnerRequests = exports.verifyOwnerRequest = exports.resendOwnerOTP = exports.verifyOwnerOTP = exports.requestOwner = void 0;
const ownerRequest_model_1 = require("../models/ownerRequest.model");
const user_model_1 = require("../models/user.model");
const email_1 = require("../mailtrap/email");
const generateToken_1 = require("../utils/generateToken");
const generateVerificationCode_1 = require("../utils/generateVerificationCode");
const requestOwner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, email, phone } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Get user ID from authenticated user
        // Validate required fields
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
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
        // Validate phone number (10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: "Phone number must be 10 digits"
            });
        }
        // Check if user already has a pending request
        const existingRequest = yield ownerRequest_model_1.OwnerRequest.findOne({ userId });
        if (existingRequest && existingRequest.status === "pending") {
            return res.status(400).json({
                success: false,
                message: "You already have a pending owner request"
            });
        }
        // If request exists but was rejected, we can allow a new request
        if (existingRequest && existingRequest.status === "rejected") {
            yield ownerRequest_model_1.OwnerRequest.findByIdAndDelete(existingRequest._id);
        }
        // Generate OTP code
        const otpCode = (0, generateVerificationCode_1.generateVerificationCode)();
        // Create new owner request
        const ownerRequest = new ownerRequest_model_1.OwnerRequest({
            userId,
            name,
            email,
            phone,
            otpCode,
            otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            status: "pending"
        });
        yield ownerRequest.save();
        // Update user's owner request status to pending
        if (userId) {
            yield user_model_1.User.findByIdAndUpdate(userId, { ownerRequestStatus: "pending" });
        }
        // Send OTP email
        try {
            yield (0, email_1.sendOwnerOTPEmail)(email, otpCode);
            console.log('OTP email sent to:', email);
        }
        catch (emailError) {
            console.error("Error sending owner OTP email:", emailError);
            // Don't fail the request if email fails, just log it
        }
        return res.status(201).json({
            success: true,
            message: "Request submitted successfully. Please check your email for OTP verification code.",
            email: email // Send email back for frontend to use
        });
    }
    catch (error) {
        console.error("Error in requestOwner:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.requestOwner = requestOwner;
const verifyOwnerOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otpCode } = req.body;
        console.log('Received OTP verification request:', { email, otpCode });
        // Validate required fields
        if (!email || !otpCode) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP code are required"
            });
        }
        // Find request with this email and OTP
        const ownerRequest = yield ownerRequest_model_1.OwnerRequest.findOne({
            email: email,
            otpCode: otpCode
        });
        console.log('Found owner request:', ownerRequest);
        if (!ownerRequest) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP code"
            });
        }
        // Check if the OTP has expired
        if (ownerRequest.otpExpiresAt && ownerRequest.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
        }
        // Mark as verified
        ownerRequest.isVerified = true;
        ownerRequest.otpCode = undefined;
        ownerRequest.otpExpiresAt = undefined;
        // Update status to verified but not yet approved
        ownerRequest.status = "pending";
        yield ownerRequest.save();
        // Update user's owner request status to verified
        if (ownerRequest.userId) {
            yield user_model_1.User.findByIdAndUpdate(ownerRequest.userId, { ownerRequestStatus: "verified" });
            const user = yield user_model_1.User.findById(ownerRequest.userId);
            if (user) {
                return res.status(200).json({
                    success: true,
                    message: "OTP verified successfully. Your request is now verified and waiting for admin approval.",
                    user: {
                        _id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        admin: user.admin,
                        ownerRequestStatus: user.ownerRequestStatus
                    }
                });
            }
        }
        return res.status(200).json({
            success: true,
            message: "OTP verified successfully. Your request is now verified and waiting for admin approval."
        });
    }
    catch (error) {
        console.error("Error in verifyOwnerOTP:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.verifyOwnerOTP = verifyOwnerOTP;
const resendOwnerOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        console.log('Resend OTP request for email:', email);
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }
        // Find pending owner request
        const ownerRequest = yield ownerRequest_model_1.OwnerRequest.findOne({
            email: email,
            status: "pending",
            isVerified: false
        });
        if (!ownerRequest) {
            return res.status(400).json({
                success: false,
                message: "No pending owner request found for this email"
            });
        }
        // Generate new OTP
        const newOtpCode = (0, generateVerificationCode_1.generateVerificationCode)();
        ownerRequest.otpCode = newOtpCode;
        ownerRequest.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        yield ownerRequest.save();
        // Send new OTP email
        try {
            yield (0, email_1.sendOwnerOTPEmail)(email, newOtpCode);
            console.log('New OTP email sent to:', email);
        }
        catch (emailError) {
            console.error("Error sending new OTP email:", emailError);
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email. Please try again."
            });
        }
        return res.status(200).json({
            success: true,
            message: "New OTP sent to your email successfully"
        });
    }
    catch (error) {
        console.error("Error in resendOwnerOTP:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.resendOwnerOTP = resendOwnerOTP;
const verifyOwnerRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        console.log('Received verification token:', token);
        // Find request with this token
        const ownerRequest = yield ownerRequest_model_1.OwnerRequest.findOne({
            verificationToken: token
        });
        console.log('Found owner request:', ownerRequest);
        if (!ownerRequest) {
            return res.status(400).json({
                success: false,
                message: "Invalid verification token"
            });
        }
        // Check if the token has expired
        if (ownerRequest.verificationTokenExpiresAt &&
            ownerRequest.verificationTokenExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Verification token has expired"
            });
        }
        // Mark as verified
        ownerRequest.isVerified = true;
        ownerRequest.verificationToken = undefined;
        ownerRequest.verificationTokenExpiresAt = undefined;
        // Automatically approve the request and make user an admin
        ownerRequest.status = "approved";
        yield ownerRequest.save();
        // Make the user an admin
        if (ownerRequest.userId) {
            yield user_model_1.User.findByIdAndUpdate(ownerRequest.userId, { admin: true });
        }
        // Generate auth token for automatic login
        const user = yield user_model_1.User.findById(ownerRequest.userId);
        if (user) {
            (0, generateToken_1.generateToken)(res, user);
            return res.status(200).json({
                success: true,
                message: "Email verified successfully. You are now an owner!",
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    admin: user.admin
                }
            });
        }
        return res.status(200).json({
            success: true,
            message: "Email verified successfully. You are now an owner! Please login to continue."
        });
    }
    catch (error) {
        console.error("Error in verifyOwnerRequest:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.verifyOwnerRequest = verifyOwnerRequest;
const getOwnerRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Only admins can get all requests
        const requests = yield ownerRequest_model_1.OwnerRequest.find({}).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            requests
        });
    }
    catch (error) {
        console.error("Error in getOwnerRequests:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.getOwnerRequests = getOwnerRequests;
const updateOwnerRequestStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { requestId } = req.params;
        const { status, adminNote } = req.body;
        // Validate status
        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'approved' or 'rejected'"
            });
        }
        // Find and update the request
        const ownerRequest = yield ownerRequest_model_1.OwnerRequest.findById(requestId);
        if (!ownerRequest) {
            return res.status(404).json({
                success: false,
                message: "Owner request not found"
            });
        }
        // Update status and note
        ownerRequest.status = status;
        if (adminNote) {
            ownerRequest.adminNote = adminNote;
        }
        yield ownerRequest.save();
        // If approved, make the user an admin and send congratulations email
        if (status === "approved" && ownerRequest.userId) {
            yield user_model_1.User.findByIdAndUpdate(ownerRequest.userId, {
                admin: true,
                ownerRequestStatus: "approved"
            });
            // Send congratulations email
            try {
                const { sendOwnerApprovalEmail } = yield Promise.resolve().then(() => __importStar(require("../mailtrap/email")));
                yield sendOwnerApprovalEmail(ownerRequest.email, ownerRequest.name);
                console.log('Congratulations email sent to:', ownerRequest.email);
            }
            catch (emailError) {
                console.error("Error sending congratulations email:", emailError);
                // Don't fail the request if email fails
            }
        }
        else if (status === "rejected" && ownerRequest.userId) {
            yield user_model_1.User.findByIdAndUpdate(ownerRequest.userId, {
                ownerRequestStatus: "rejected"
            });
        }
        return res.status(200).json({
            success: true,
            message: `Request ${status} successfully`,
            request: ownerRequest
        });
    }
    catch (error) {
        console.error("Error in updateOwnerRequestStatus:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.updateOwnerRequestStatus = updateOwnerRequestStatus;
const createOwnerRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone } = req.body;
        const userId = req.id; // Get user ID from authenticated user
        // Validate required fields
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        // Check if user already has a request
        const existingRequest = yield ownerRequest_model_1.OwnerRequest.findOne({ userId });
        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "You already have an owner request"
            });
        }
        // Create new owner request with verified status
        const ownerRequest = new ownerRequest_model_1.OwnerRequest({
            userId,
            name,
            email,
            phone,
            isVerified: true,
            status: "pending" // This means pending admin approval
        });
        yield ownerRequest.save();
        // Update user's owner request status to verified (waiting for admin approval)
        yield user_model_1.User.findByIdAndUpdate(userId, { ownerRequestStatus: "verified" });
        return res.status(201).json({
            success: true,
            message: "Owner request created successfully. Please wait for admin approval."
        });
    }
    catch (error) {
        console.error("Error in createOwnerRequest:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
});
exports.createOwnerRequest = createOwnerRequest;
