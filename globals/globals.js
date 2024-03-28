import { config } from 'dotenv';
config();

// Server secrets
export const PORT = process.env.PORT || 5000;
export const DEFAULT_IMAGE_URL = process.env.DEFAULT_IMAGE_URL;
export const BCRYPT_SALT = process.env.BCRYPT_SALT || 10;
export const CLIENT_URL = process.env.CLIENT_URL;
export const ENV = process.env.ENV;

// JWT keys
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_LIFETIME = process.env.JWT_LIFETIME || '30d';

// MongoDB keys
export const MONGO_URI = process.env.MONGO_URI;

// For admin dashboard
export const MONGO_DB_AWS_OBJECT_ID = process.env.MONGO_DB_AWS_OBJECT_ID;

// Google Key used for nodemailer
export const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD;
export const GOOGLE_USER_ID = process.env.GOOGLE_USER_ID;

// AWS Keys
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_REGION = process.env.AWS_REGION;
export const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
