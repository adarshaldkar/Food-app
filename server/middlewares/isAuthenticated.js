"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    console.log('\n=== AUTHENTICATION MIDDLEWARE DEBUG ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    console.log('Cookies received:', req.cookies);
    console.log('Cookie header:', req.headers.cookie);
    console.log('All cookie keys:', Object.keys(req.cookies));
    try {
        const token = req.cookies.token;
        console.log('Token found:', token ? 'YES' : 'NO');
        if (!token) {
            console.log('❌ Authentication failed: No token found');
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }
        try {
            console.log('🔐 Verifying JWT token...');
            const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            console.log('JWT decode result:', decode);
            if (!decode || !decode.userId) {
                console.log('❌ Invalid token structure:', decode);
                throw new Error("Invalid token structure");
            }
            req.id = decode.userId;
            console.log('✅ Authentication successful, user ID:', req.id);
            next();
        }
        catch (jwtError) {
            console.log('❌ JWT verification failed:', jwtError);
            // Clear the invalid token
            res.clearCookie('token');
            res.status(401).json({
                success: false,
                message: "Session expired. Please login again."
            });
            return;
        }
    }
    catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        return;
    }
};
exports.isAuthenticated = isAuthenticated;
