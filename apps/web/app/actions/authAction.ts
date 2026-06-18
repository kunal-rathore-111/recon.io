
"use server"

import { createSession, deleteSession } from "@/lib/session";
import { db, usersTable } from "@repo/database";
import { signInValidationFn, signUpValidationFn } from "@repo/validation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
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
            if (!existingUser[0].hashedPassword) return { error: "No password present, please try forget password" };

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