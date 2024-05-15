import dotenv from 'dotenv';
dotenv.config();
import cloudinary from 'cloudinary';

// Configura tus credenciales de Cloudinary

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export default cloudinary;