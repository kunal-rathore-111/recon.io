
"use server"

import { createTransport } from "nodemailer";

const transporter = createTransport({
    service: "gmail",
    host: "://gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTIP_PASS,
    }
});

// send OTP function
async function sendOTP() {

    const mail = 

}

