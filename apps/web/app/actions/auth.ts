
"use server"

import { createSession, deleteSession } from "@/lib/session";
import { db, UsersTable } from "@repo/database";
import { signValidationFn } from "@repo/validation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";




export async function signUpAction(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const validation = signValidationFn({ email, password });
    if (!validation.success) {

        return {
            error: validation.error.issues[0].message
                || "Invalid input fields"
        }
    }
    else {
        try {
            const existingUser = await db.select().from(UsersTable).where(eq(UsersTable.email, email)).limit(1);
            if (existingUser.length > 0) {
                return { error: "User with this email already exists" }
            }
            else {
                const hashedPass = await bcrypt.hash(password, 10);

                const newUser = await db.insert(UsersTable).values({
                    email, passwordHash: hashedPass
                }).returning();

                if (!newUser[0]) return { error: "Failed to create users" }

                else {
                    await createSession(
                        {
                            email: newUser[0].email,
                            userId: newUser[0].id
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

    const validation = signValidationFn({
        email,
        password
    })
    if (!validation.success) {
        return { error: validation.error.issues[0].message || "Invalid input" };
    }
    try {
        const existingUser = await db.select().from(UsersTable).where(eq(UsersTable.email, email)).limit(1);

        if (existingUser.length === 0) {
            return { error: `User with ${email} not found` }
        }

        else {
            // check password
            const isValidPassword = await bcrypt.compare(password, existingUser[0].passwordHash);

            if (!isValidPassword) {
                return { error: "Invalid password" }
            }
            else {
                await createSession({
                    email: existingUser[0].email,
                    userId: existingUser[0].id
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
    redirect('/?logout=true');

}