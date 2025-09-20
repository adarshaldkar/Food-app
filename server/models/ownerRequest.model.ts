import mongoose from "mongoose";

export interface IOwnerRequest {
    userId?: string;
    name: string;
    email: string;
    phone: string;
    isVerified: boolean;
    verificationToken?: string;
    verificationTokenExpiresAt?: Date;
    otpCode?: string;
    otpExpiresAt?: Date;
    status: "pending" | "approved" | "rejected";
    adminNote?: string;
}

export interface IOwnerRequestDocument extends IOwnerRequest, Document {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

const ownerRequestSchema = new mongoose.Schema<IOwnerRequestDocument>({
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

export const OwnerRequest = mongoose.model("OwnerRequest", ownerRequestSchema);