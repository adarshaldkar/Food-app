import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            id?: string;
        }
    }
}

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    console.log('\n=== AUTHENTICATION MIDDLEWARE DEBUG ===');
    console.log('Request URL:', req.url);
    console.log('Request method:', req.method);
    console.log('Cookies received:', req.cookies);
    
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
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { userId: string };
            console.log('JWT decode result:', decode);
            
            if (!decode || !decode.userId) {
                console.log('❌ Invalid token structure:', decode);
                throw new Error("Invalid token structure");
            }
            
            req.id = decode.userId;
            console.log('✅ Authentication successful, user ID:', req.id);
            next();
        } catch (jwtError) {
            console.log('❌ JWT verification failed:', jwtError);
            // Clear the invalid token
            res.clearCookie('token');
            res.status(401).json({
                success: false,
                message: "Session expired. Please login again."
            });
            return;
        }
        
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        return;
    }
}
