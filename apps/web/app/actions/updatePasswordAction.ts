"use server";

import { deleteOTPSession, getForgotPasswordSession } from "@/lib/session";
import { getDb, usersTable } from "@repo/database";
import { passwordValidation } from "@repo/validation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";



export async function updatePasswordAction(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    //console.error(password);

    if (!email || !password) {
        return { error: "Input is empty." }
    }
    const validatePassword = passwordValidation(password);
    if (!validatePassword.success) {
        return {
            error: validatePassword.error.issues[0].message
        }
    }
    else {
        //check session (what if user directly call this api)
        try {
            const forgotPasswordSession = await getForgotPasswordSession();

            if (!forgotPasswordSession)
                return { error: "Session expired. Please request a new OTP." };

            else {
                // validate both emails are same
                if (forgotPasswordSession.email != email)
                    return { error: "We couldn't verify this email address. Please try again." }

                else {
                    // delete cookie-> hashPass-> store in db
                    await deleteOTPSession();
                    const hashedPassword = await bcrypt.hash(password, 10);
                    const db = getDb();
                    await db.
                        update(usersTable)
                        .set({ hashedPassword: hashedPassword })
                        .where(eq(usersTable.email, email));

                    return { message: "Password updated successfully." }
                }
            }
        } catch (error) {
            console.error("Error in updatePasswordAction: ", error);
            return { error: "Something went wrong, Please try again later." }
        }

    }
}