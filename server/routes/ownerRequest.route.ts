import express from "express";
import { 
    requestOwner, 
    verifyOwnerRequest, 
    verifyOwnerOTP,
    resendOwnerOTP,
    getOwnerRequests, 
    updateOwnerRequestStatus,
    createOwnerRequest 
} from "../controller/ownerRequest.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";

const router = express.Router();

// Public routes
router.route("/verify/:token").get(verifyOwnerRequest);
router.route("/verify-otp").post(verifyOwnerOTP);
router.route("/resend-otp").post(resendOwnerOTP);

// Authenticated routes
router.route("/request").post(isAuthenticated, requestOwner);
router.route("/create-request").post(isAuthenticated, createOwnerRequest);

// Admin routes
router.route("/").get(isAuthenticated, getOwnerRequests);
router.route("/:requestId/status").put(isAuthenticated, updateOwnerRequestStatus);

export default router;