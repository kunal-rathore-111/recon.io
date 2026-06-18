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
        const { payload } = await jwtVerify(token, key);
        return payload;
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
    })
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session")
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;
    return await checkJWT(token);
}