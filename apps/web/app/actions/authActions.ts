
"use server"

import { createForgotPasswordSession, createSession, deleteSession } from "@/lib/session";
import { db, forgotPassword_OTP_Table, signUp_OTP_Table, usersTable } from "@repo/database";
import { signInValidationFn, signUpValidationFn } from "@repo/validation";
import bcrypt from "bcryptjs";
import { and, eq } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";




export async function signUpAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const validation = signUpValidationFn({ email, password, name });
    if (!validation.success) {
        return {
            error: validation.error.issues[0].message
                || "Invalid input fields"
        }
    }
    else {
        try {
            const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
            if (existingUser.length > 0) {
                return { error: "User with this email already exists" }
            }
            else {
                const hashedPass = await bcrypt.hash(password, 10);

                const newUser = await db.insert(usersTable).values({
                    name, email, hashedPassword: hashedPass,
                }).returning();

                if (!newUser[0]) return { error: "Failed to create users" }

                else {
                    await createSession(
                        {
                            email: newUser[0].email,
                            userId: newUser[0].id,
                            name: newUser[0].name
                        }
                    )
                    redirect('/dashboard') // will throw error next-redirect

                }
            }
        } catch (error) {
            if (isRedirectError(error)) {
                throw error;
            }
            console.error("Signup error: ", error);
            return { error: "An unexpected error occurred during signup. Please try again." };
        }
    }
}

export async function signInAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const validation = signInValidationFn({
        email,
        password
    })
    if (!validation.success) {
        return { error: validation.error.issues[0].message || "Invalid input" };
    }
    try {
        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

        if (existingUser.length === 0) {
            return { error: `User with ${email} not found` }
        }

        else {
            // check password
            if (!existingUser[0].hashedPassword) return { error: "No password present, please try forgot password" };

            const isValidPassword = await bcrypt.compare(password, existingUser[0]?.hashedPassword);

            if (!isValidPassword) {
                return { error: "Invalid password" }
            }
            else {
                await createSession({
                    email: existingUser[0].email,
                    userId: existingUser[0].id,
                    name: existingUser[0].name
                });

                redirect("/dashboard")
            }
        }

    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
        }
        console.error("Error in signInAction: ", error);
        return { error: "An unexpected error occurred during sign-in. Please try again." }
    }
}

export async function signOutAction() {
    await deleteSession();
    redirect('/auth/sign-in/?logout=true');

}


export async function validateOTPAction(prevState: any, formData: FormData) {
    try {
        // check inputs->
        // find in table using email only->
        // check found->
        //  if notFound-> return error
        //   else->
        //       check attempts and otp->
        //            if incorrect OTP AND less attempts return error,
        //            else more attempts or correct OTP->
        //                   delete the entry->
        //             if more attepts return Error->
        //             else if correct otp redirect->
        //             else return error
        const email = formData.get("email") as string;
        const otp = formData.get("otp") as string;

        const type = formData.get("type");
        if (!email || !otp || !type) {
            return { error: "Input field is empty" };
        }

        let find = null;
        if (type === "forgotPassword") {
            find = await db
                .select()
                .from(forgotPassword_OTP_Table)
                .where(
                    eq(forgotPassword_OTP_Table.email, email),
                );
        }

        else if (type === "createAccount") {
            find = await db
                .select()
                .from(signUp_OTP_Table)
                .where(
                    eq(signUp_OTP_Table.email, email),
                );
        }

        if (!find || !find.length) {
            return { error: "Invalid email" };
        }

        else if (find[0].attempts < 3 && otp !== find[0].otp) {

            if (type === "forgotPassword") {
                await db.update(forgotPassword_OTP_Table).set({ attempts: find[0].attempts + 1 }).where(eq(forgotPassword_OTP_Table.email, email));

            }

            else if (type === "createAccount") {
                await db.update(signUp_OTP_Table).set({ attempts: find[0].attempts + 1 }).where(eq(signUp_OTP_Table.email, email));
            }

            return { error: "Invalid OTP." }
        }
        else {

            // delete the OTP then check attempts, then check expiry, if all done then redirect or return

            // delete OTP
            if (type === "forgotPassword") {
                await db.delete(forgotPassword_OTP_Table).where(eq(forgotPassword_OTP_Table.email, email));

            }

            else if (type === "createAccount") {
                await db.delete(signUp_OTP_Table).where(eq(signUp_OTP_Table.email, email));
            }

            // check attempts
            if (find[0].attempts >= 3) {
                return { error: "Maximum 3 attempts are allowed, please regenerate OTP." }
            }

            if (find[0].otp === otp) {

                // check EXPIRY AND REDIRECT
                if (find[0].expiresAt > new Date()) {

                    if (type === "forgotPassword") {
                        // add cookie and redirect
                        await createForgotPasswordSession({ email, otp });
                        redirect('/forgot-password/reset-password');
                    }

                    else if (type === "createAccount") {

                        await db.update(usersTable).set({ isVerified: true }).where(eq(usersTable.email, email));
                        return { success: true };
                    }
                }
                else {
                    return { error: "OTP expired." }
                }
            }
            else {
                return { error: "Invalid OTP" }
            }
        }

    } catch (error) {
        if (isRedirectError(error)) throw error;
        console.error("Error in validateOTPAction: ", error);

        return { error: "Something went wrong in validating OTP, please try again." };
    }
}