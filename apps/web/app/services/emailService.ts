
"use server"

import { getDb, forgotPassword_OTP_Table, signUp_OTP_Table, usersTable } from "@repo/database";
import { eq } from "drizzle-orm";
import { createTransport } from "nodemailer";

const transporter = createTransport({
    service: "gmail",

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
});

function generateOTP() {
    let otpCode = "";
    for (let i = 0; i < 6; i++) {
        otpCode += (Math.floor(Math.random() * 10));
    }
    //  console.error(otpCode)
    return otpCode;
}

// send OTP function
export async function sendOTP(toEmail: string, OTPType: 'forgotPassword' | 'createAccount') {

    try {
        const db = getDb();
        // check user present or not
        const findUser = await db.select().from(usersTable).where(eq(usersTable.email, toEmail)).limit(1);
        if (!findUser.length) return { error: "User not found, Please sign-up." };

        // generate OTP
        const otpCode = generateOTP();
        // store otp for the user in db and send email

        const currentTime = new Date();
        const newMinutes = currentTime.getMinutes() + 15;
        const extendedTime = currentTime.setMinutes(newMinutes);
        const expiryDate = new Date(extendedTime);

        if (OTPType === 'forgotPassword') {
            //find in db first
            const find = await db
                .select()
                .from(forgotPassword_OTP_Table)
                .where(
                    eq(forgotPassword_OTP_Table.email, toEmail)
                )
                .limit(1);

            if (find.length) {
                await db
                    .update(forgotPassword_OTP_Table)
                    .set(
                        { otp: otpCode, expiresAt: expiryDate }
                    )
                    .where(
                        eq(forgotPassword_OTP_Table.email, toEmail)
                    );
            }
            else {
                await db
                    .insert(forgotPassword_OTP_Table)
                    .values({
                        email: toEmail,
                        otp: otpCode,
                        expiresAt: expiryDate
                    });
            }
        }
        else if (OTPType === "createAccount") {

            //find in db first
            const find = await db
                .select()
                .from(signUp_OTP_Table)
                .where(
                    eq(signUp_OTP_Table.email, toEmail)
                )
                .limit(1);

            if (find.length) {
                await db
                    .update(signUp_OTP_Table)
                    .set(
                        { otp: otpCode, expiresAt: expiryDate }
                    )
                    .where(
                        eq(forgotPassword_OTP_Table.email, toEmail)
                    );
            }
            else {
                await db
                    .insert(signUp_OTP_Table)
                    .values({
                        email: toEmail,
                        otp: otpCode,
                        expiresAt: expiryDate
                    });
            }
        }

        const mail = {
            from: `Recon - AI <${process.env.SMTP_USER}>`,
            to: toEmail,
            subject: `Verification Code`,
            html: `
         <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #333;">Account Verification</h2>
        <p>Your one-time security code is valid for 15 minutes:</p>
        <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111; margin: 20px 0; border-radius: 4px;">
          ${otpCode}
        </div>
        <p style="color: #777; font-size: 12px;">If you didn't request this code, please secure your account immediately.</p>
      </div>`
        }

        await transporter.sendMail(mail);

        return { message: "OTP send successfully, please check your mail." };

    } catch (error) {
        console.error("Something went wrong in sendOTP function: ", error);
        return { error: "Something went wrong, please try again." }
    }

}

