"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true
    },
    address: {
        type: String,
        default: "Update your address"
    },
    city: {
        type: String,
        default: "Update your city"
    },
    country: {
        type: String,
        default: "Update your country"
    },
    profilePicture: {
        type: String,
        default: "Update your profile picture"
    },
    admin: { type: Boolean, default: false },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    ownerRequestStatus: {
        type: String,
        enum: ["none", "pending", "verified", "approved", "rejected"],
        default: "none"
    },
    emailVerificationOTP: {
        type: String,
        required: false
    },
    emailVerificationOTPExpiresAt: {
        type: Date,
        required: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    signupOTP: {
        type: String,
        required: false
    },
    signupOTPExpiresAt: {
        type: Date,
        required: false
    },
}, { timestamps: true });
exports.User = mongoose_1.default.model("User", userSchema);
