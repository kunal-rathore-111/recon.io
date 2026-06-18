"use server"

import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers";


interface jwtInput {
    email: string,
    userId: string,
    name: string
}
const jwtSecret = process.env.JWT_SECRET || "#!D#G%,kl3I";

const key = new TextEncoder().encode(jwtSecret);

export async function createJWT(payload: jwtInput) {
    return await new SignJWT({ ...payload }).setProtectedHeader({ alg: "HS256" }).setExpirationTime('7d').sign(key)
}

export async function checkJWT(token: string) {
    try {
        const result = await jwtVerify(token, key);
        return result.payload;
    } catch (error) {
        return null;
    }
}


export async function createSession(user: jwtInput) {
    const cookieStore = await cookies();
    const token = await createJWT(user);
    cookieStore.delete("session")  // clear old one first

    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7 // 7days
    });
    return;
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;
    return await checkJWT(token);
}


interface createForgotPasswordSessionDTO {
    email: string,
    otp: string,
}

export async function createForgotPasswordSession(input: createForgotPasswordSessionDTO) {
    const cookieStore = await cookies();

    const jwtToken = await new SignJWT({ ...input }).setExpirationTime('10m').setProtectedHeader({ alg: "HS256" }).sign(key);

    cookieStore.delete('forgotPasswordSession'); // delete previous one if present

    cookieStore.set("forgotPasswordSession", jwtToken, {
        httpOnly: true,
        maxAge: 10 * 60, // 10 mints
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });
    return;
}

export async function getForgotPasswordSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get('forgotPasswordSession')?.value;
    if (!token) return null;
    else {
        try {
            const result = await jwtVerify(token, key);
            return result.payload;
        } catch (error) {
            return null;
        }
    }
}

