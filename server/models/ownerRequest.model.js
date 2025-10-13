"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerRequest = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ownerRequestSchema = new mongoose_1.default.Schema({
    userId: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        required: false
    },
    verificationTokenExpiresAt: {
        type: Date,
        required: false
    },
    otpCode: {
        type: String,
        required: false
    },
    otpExpiresAt: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    adminNote: {
        type: String,
        required: false
    }
}, { timestamps: true });
exports.OwnerRequest = mongoose_1.default.model("OwnerRequest", ownerRequestSchema);
