"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ownerRequest_controller_1 = require("../controller/ownerRequest.controller");
const isAuthenticated_1 = require("../middlewares/isAuthenticated");
const router = express_1.default.Router();
// Public routes
router.route("/verify/:token").get(ownerRequest_controller_1.verifyOwnerRequest);
router.route("/verify-otp").post(ownerRequest_controller_1.verifyOwnerOTP);
router.route("/resend-otp").post(ownerRequest_controller_1.resendOwnerOTP);
// Authenticated routes
router.route("/request").post(isAuthenticated_1.isAuthenticated, ownerRequest_controller_1.requestOwner);
router.route("/create-request").post(isAuthenticated_1.isAuthenticated, ownerRequest_controller_1.createOwnerRequest);
// Admin routes
router.route("/").get(isAuthenticated_1.isAuthenticated, ownerRequest_controller_1.getOwnerRequests);
router.route("/:requestId/status").put(isAuthenticated_1.isAuthenticated, ownerRequest_controller_1.updateOwnerRequestStatus);
exports.default = router;
