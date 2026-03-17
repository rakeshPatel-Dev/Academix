// src/config/env.config.js
import dotenv from 'dotenv';
import path from 'path';
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });


const config = {
  development: {
    MONGODB_URI: process.env.MONGODB_URI,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    PORT: process.env.PORT || 3000,
    SMTP: {
      SERVICE: process.env.SMTP_SERVICE,
      USER: process.env.SMTP_USER,
      PASS: process.env.SMTP_PASS,
      FROM: process.env.SMTP_FROM,
      HOST: process.env.SMTP_HOST,
      PORT: process.env.SMTP_PORT,
    }
  },
  production: {
    MONGODB_URI: process.env.MONGODB_URI,
    FRONTEND_URL: process.env.FRONTEND_URL || 'https://academix-rakesh.vercel.app',
    PORT: process.env.PORT || 3000,
    SMTP: {
      SERVICE: process.env.SMTP_SERVICE,
      USER: process.env.SMTP_USER,
      PASS: process.env.SMTP_PASS,
      FROM: process.env.SMTP_FROM,
      HOST: process.env.SMTP_HOST,
      PORT: process.env.SMTP_PORT,
    }
  },
};

const currentConfig = config[env];

if (!currentConfig.MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is missing');
}

if (!currentConfig.FRONTEND_URL) {
  throw new Error('❌ FRONTEND_URL is missing');
}

export default config;