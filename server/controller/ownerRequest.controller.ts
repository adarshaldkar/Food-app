import { Request, Response } from "express";
import { OwnerRequest } from "../models/ownerRequest.model";
import { User } from "../models/user.model";
import crypto from "crypto";
import { sendOwnerRequestVerificationEmail, sendOwnerOTPEmail } from "../mailtrap/email";
import { generateToken } from "../utils/generateToken";
import { generateVerificationCode } from "../utils/generateVerificationCode";

export const requestOwner = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, phone } = req.body;
        const userId = (req as any).user?._id; // Get user ID from authenticated user
        
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
        const existingRequest = await OwnerRequest.findOne({ userId });
        if (existingRequest && existingRequest.status === "pending") {
            return res.status(400).json({
                success: false,
                message: "You already have a pending owner request"
            });
        }
        
        // If request exists but was rejected, we can allow a new request
        if (existingRequest && existingRequest.status === "rejected") {
            await OwnerRequest.findByIdAndDelete(existingRequest._id);
        }
        
        // Generate OTP code
        const otpCode = generateVerificationCode();
        
        // Create new owner request
        const ownerRequest = new OwnerRequest({
            userId,
            name,
            email,
            phone,
            otpCode,
            otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            status: "pending"
        });
        
        await ownerRequest.save();
        
        // Update user's owner request status to pending
        if (userId) {
            await User.findByIdAndUpdate(userId, { ownerRequestStatus: "pending" });
        }
        
        // Send OTP email
        try {
            await sendOwnerOTPEmail(email, otpCode);
            console.log('OTP email sent to:', email);
        } catch (emailError) {
            console.error("Error sending owner OTP email:", emailError);
            // Don't fail the request if email fails, just log it
        }
        
        return res.status(201).json({
            success: true,
            message: "Request submitted successfully. Please check your email for OTP verification code.",
            email: email // Send email back for frontend to use
        });
    } catch (error) {
        console.error("Error in requestOwner:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const verifyOwnerOTP = async (req: Request, res: Response): Promise<any> => {
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
        const ownerRequest = await OwnerRequest.findOne({
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
        await ownerRequest.save();
        
        // Update user's owner request status to verified
        if (ownerRequest.userId) {
            await User.findByIdAndUpdate(ownerRequest.userId, { ownerRequestStatus: "verified" });
            
            const user = await User.findById(ownerRequest.userId);
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
    } catch (error) {
        console.error("Error in verifyOwnerOTP:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const resendOwnerOTP = async (req: Request, res: Response): Promise<any> => {
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
        const ownerRequest = await OwnerRequest.findOne({
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
        const newOtpCode = generateVerificationCode();
        ownerRequest.otpCode = newOtpCode;
        ownerRequest.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await ownerRequest.save();
        
        // Send new OTP email
        try {
            await sendOwnerOTPEmail(email, newOtpCode);
            console.log('New OTP email sent to:', email);
        } catch (emailError) {
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
    } catch (error) {
        console.error("Error in resendOwnerOTP:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const verifyOwnerRequest = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.params;
        console.log('Received verification token:', token);
        
        // Find request with this token
        const ownerRequest = await OwnerRequest.findOne({
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
        await ownerRequest.save();
        
        // Make the user an admin
        if (ownerRequest.userId) {
            await User.findByIdAndUpdate(ownerRequest.userId, { admin: true });
        }
        
        // Generate auth token for automatic login
        const user = await User.findById(ownerRequest.userId);
        if (user) {
            generateToken(res, user);
            
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
    } catch (error) {
        console.error("Error in verifyOwnerRequest:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getOwnerRequests = async (req: Request, res: Response): Promise<any> => {
    try {
        // Only admins can get all requests
        const requests = await OwnerRequest.find({}).sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        console.error("Error in getOwnerRequests:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const updateOwnerRequestStatus = async (req: Request, res: Response): Promise<any> => {
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
        const ownerRequest = await OwnerRequest.findById(requestId);
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
        
        await ownerRequest.save();
        
        // If approved, make the user an admin and send congratulations email
        if (status === "approved" && ownerRequest.userId) {
            await User.findByIdAndUpdate(ownerRequest.userId, { 
                admin: true,
                ownerRequestStatus: "approved"
            });
            
            // Send congratulations email
            try {
                const { sendOwnerApprovalEmail } = await import("../mailtrap/email");
                await sendOwnerApprovalEmail(ownerRequest.email, ownerRequest.name);
                console.log('Congratulations email sent to:', ownerRequest.email);
            } catch (emailError) {
                console.error("Error sending congratulations email:", emailError);
                // Don't fail the request if email fails
            }
        } else if (status === "rejected" && ownerRequest.userId) {
            await User.findByIdAndUpdate(ownerRequest.userId, { 
                ownerRequestStatus: "rejected"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: `Request ${status} successfully`,
            request: ownerRequest
        });
    } catch (error) {
        console.error("Error in updateOwnerRequestStatus:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const createOwnerRequest = async (req: Request, res: Response): Promise<any> => {
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
        const existingRequest = await OwnerRequest.findOne({ userId });
        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "You already have an owner request"
            });
        }
        
        // Create new owner request with verified status
        const ownerRequest = new OwnerRequest({
            userId,
            name,
            email,
            phone,
            isVerified: true,
            status: "pending" // This means pending admin approval
        });
        
        await ownerRequest.save();
        
        // Update user's owner request status to verified (waiting for admin approval)
        await User.findByIdAndUpdate(userId, { ownerRequestStatus: "verified" });
        
        return res.status(201).json({
            success: true,
            message: "Owner request created successfully. Please wait for admin approval."
        });
    } catch (error) {
        console.error("Error in createOwnerRequest:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
