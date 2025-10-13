"use strict";
// import express, { Request, Response, NextFunction } from "express";
// import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from "../controller/user.controller";
// import { isAuthenticated } from "../middlewares/isAuthenticated";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const router = express.Router();
// type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
// const wrapAsync = (handler: AsyncHandler) => async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     await handler(req, res, next);
//   } catch (error) {
//     next(error);
//   }
// };
// router.route("/check-auth").get(wrapAsync(checkAuth));
// router.route("/signup").post(wrapAsync(signup));
// router.route("/login").post(wrapAsync(login));
// router.route("/logout").post(wrapAsync(logout));
// router.route("/verify-email").post(wrapAsync(verifyEmail));
// router.route("/forgot-password").post(wrapAsync(forgotPassword));
// router.route("/reset-password/:token").post(wrapAsync(resetPassword));
// router.route("/profile/update").put( wrapAsync(updateProfile));
// export default router;
// import express,{Request,Response} from "express";
// import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from "../controller/user.controller";
// import {isAuthenticated}  from "../middlewares/isAuthenticated";
// const router = express.Router();
// router.route("/check-auth").get(isAuthenticated, checkAuth);
// router.route("/signup").post(signup);
// router.route("/login").post(login);
// router.route("/logout").post(logout);
// router.route("/verify-email").post(verifyEmail);
// router.route("/forgot-password").post(forgotPassword);
// router.route("/reset-password/:token").post(resetPassword);
// router.route("/profile/update").put(isAuthenticated,updateProfile);
// export default router;
// // import express, { Request, Response, NextFunction } from "express";
// // import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from "../controller/user.controller";
// // import { isAuthenticated } from "../middlewares/isAuthentictated";
// // const router = express.Router();
// // // Utility function to catch async errors
// // const wrapAsync = (handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
// //   (req: Request, res: Response, next: NextFunction) => {
// //     handler(req, res, next).catch(next); // Pass any error to Express error handling middleware
// //   };
// // router.route("/check-auth").get(isAuthenticated, wrapAsync(checkAuth));
// // router.route("/signup").post(wrapAsync(signup));
// // router.route("/login").post(wrapAsync(login));
// // router.route("/logout").post(wrapAsync(logout));
// // router.route("/verify-email").post(wrapAsync(verifyEmail));
// // router.route("/forgot-password").post(wrapAsync(forgotPassword));
// // router.route("/reset-password/:token").post(wrapAsync(resetPassword));
// // router.route("/profile/update").put(isAuthenticated, wrapAsync(updateProfile));
// // export default router;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const user_controller_2 = require("../controller/user.controller");
const router = express_1.default.Router();
router.route("/checkAuth").get(isAuthenticated_1.isAuthenticated, user_controller_1.checkAuth);
router.route("/signup").post(user_controller_1.signup);
router.route("/login").post(user_controller_1.login);
router.route("/logout").post(user_controller_1.logout);
router.route("/verify-email").post(user_controller_1.verifyEmail);
router.route("/verify-signup-otp").post(user_controller_1.verifySignupOTP);
router.route("/resend-signup-otp").post(user_controller_1.resendSignupOTP);
router.route("/forgot-password").post(user_controller_1.forgotPassword);
router.route("/reset-password/:token").post(user_controller_1.resetPassword);
router.route("/profile/update").put(isAuthenticated_1.isAuthenticated, user_controller_2.updateProfile);
router.route("/send-email-verification-otp").post(user_controller_1.sendEmailVerificationOTP);
router.route("/verify-email-otp").post(user_controller_1.verifyEmailOTP);
exports.default = router;
// import express, { Request, Response, NextFunction } from "express";
// import { checkAuth, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from "../controller/user.controller";
// import { isAuthenticated } from "../middlewares/isAuthenticated";
// const router = express.Router();
// type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
// // Centralized async error handling wrapper
// const wrapAsync = (handler: AsyncHandler) => async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     await handler(req, res, next);
//   } catch (error) {
//     next(error);
//   }
// };
// // Routes
// router.route("/check-auth").get(isAuthenticated, wrapAsync(checkAuth));
// router.route("/signup").post(wrapAsync(signup));
// router.route("/login").post(wrapAsync(login));
// router.route("/logout").post(wrapAsync(logout));
// router.route("/verify-email").post(wrapAsync(verifyEmail));
// router.route("/forgot-password").post(wrapAsync(forgotPassword));
// router.route("/reset-password/:token").post(wrapAsync(resetPassword));
// router.route("/profile/update").put(isAuthenticated, wrapAsync(updateProfile));
// export default router;
