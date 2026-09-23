import { createTransport } from 'nodemailer';

// URL del frontend, usato per costruire il link `${FRONTEND_URL}/confirm/${token}`
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4200';

// Provider SMTP: MAIL_USER/MAIL_PASS vanno impostati nell'ambiente (es. Gmail + App Password)
export const mailTransporter = createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.MAIL_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

