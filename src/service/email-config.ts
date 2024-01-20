import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const mailsender = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
    },
});

export default mailsender;
