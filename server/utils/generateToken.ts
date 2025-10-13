import jwt from 'jsonwebtoken';
import { IUserDocument } from '../models/user.model';
import { Response } from "express";

export const generateToken = (res: Response, user: IUserDocument) => {
    const token = jwt.sign(
        { userId: user._id.toString() },
        process.env.JWT_SECRET_KEY!,
        { expiresIn: "1d" }
    );
    
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie("token", token, {
        httpOnly: true,
        sameSite: isProduction ? 'strict' : 'lax',
        secure: isProduction, // Only use secure in production
        maxAge: 24 * 60 * 60 * 1000,
        domain: isProduction ? undefined : 'localhost' // Set domain for localhost in dev
    });
    return token;
}
