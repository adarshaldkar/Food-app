import mongoose, {Document} from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  contact: string;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  admin: boolean;
  lastLogin?: Date;
  isVerified?: boolean;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
  ownerRequestStatus?: string;
  emailVerificationOTP?: string;
  emailVerificationOTPExpiresAt?: Date;
  emailVerified?: boolean;
  signupOTP?: string;
  signupOTPExpiresAt?: Date;
}

export interface IUserDocument extends IUser, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    address: {
      type: String,
      default: "Update your address",
    },
    city: {
      type: String,
      default: "Update your city",
    },
    country: {
      type: String,
      default: "Update your country",
    },
    profilePicture: {
      type: String,
      default: "Update your profile picture",
    },
    admin: {type: Boolean, default: false},
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
    ownerRequestStatus: {
      type: String,
      enum: ["none", "pending", "verified", "approved", "rejected"],
      default: "none",
    },
    emailVerificationOTP: {
      type: String,
      required: false,
    },
    emailVerificationOTPExpiresAt: {
      type: Date,
      required: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    signupOTP: {
      type: String,
      required: false,
    },
    signupOTPExpiresAt: {
      type: Date,
      required: false,
    },
  },
  {timestamps: true}
);

export const User = mongoose.model("User", userSchema);
