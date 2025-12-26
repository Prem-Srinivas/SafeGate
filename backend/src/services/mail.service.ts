// import nodemailer from 'nodemailer';

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

export const sendNotificationEmail = async (to: string, subject: string, text: string) => {
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
};
