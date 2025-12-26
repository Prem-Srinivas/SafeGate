"use strict";
// import nodemailer from 'nodemailer';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotificationEmail = void 0;
// Email notifications disabled by user request
// Configure these with your email provider details if needed in future
/*
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred service
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});
*/
const sendNotificationEmail = (to, subject, text) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //     const info = await transporter.sendMail({
    //         from: '"SafeGate System" <no-reply@safegate.com>',
    //         to,
    //         subject,
    //         text
    //     });
    //     console.log('Message sent: %s', info.messageId);
    //     return true;
    // } catch (error) {
    //     console.error('Error sending email:', error);
    //     return false;
    // }
    console.log(`[EMAIL DISABLED] Would send to: ${to}, Subject: ${subject}`);
    return true;
});
exports.sendNotificationEmail = sendNotificationEmail;
