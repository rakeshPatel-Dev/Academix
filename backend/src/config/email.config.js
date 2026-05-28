import nodemailer from 'nodemailer';
import config from './env.config.js';

const env = process.env.NODE_ENV || 'development';
const smtpConfig = config[env].SMTP;

if (!config[env] || !config[env].SMTP) {
  throw new Error(`SMTP configuration missing for environment: ${env}`);
}

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: smtpConfig.SERVICE,
  auth: {
    user: smtpConfig.USER,
    pass: smtpConfig.PASS,
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

export default transporter;

