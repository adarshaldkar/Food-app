import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.API_KEY || !process.env.API_SECRET || !process.env.CLOUD_NAME) {
    throw new Error('Missing required cloudinary environment variables');
}

cloudinary.config({
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET, 
    cloud_name: process.env.CLOUD_NAME, 
});

export default cloudinary;