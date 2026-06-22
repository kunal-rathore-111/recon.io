
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose"



const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const authRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    prefix: 'rl:auth'
})

const otpRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    prefix: 'rl:otp'
});


async function getSessionFromRequest(request: NextRequest) {
    const token = request.cookies.get('session')?.value;
    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch {
        return null;  // expired or tampered JWT → treat as unauthenticated
    }
}

export default async function proxy(request: NextRequest) {

    const { pathname } = request.nextUrl;

    const ip = request.headers.get('x-forwarded-for') ?? "127.0.0.1";

    if (pathname.startsWith("/auth/sign-in") || pathname.startsWith('/auth/sign-up') || pathname.startsWith("/auth/forgot-password")) {

        const { success } = await authRateLimit.limit(ip);
        if (!success) {
            return NextResponse.json({
                error: "Too many requests. Please wait a minute."
            }, { status: 429 })
        }
    }

    if (pathname.startsWith('/auth/verify-otp')) {
        const { success } = await otpRateLimit.limit(ip);

        if (!success) {
            return NextResponse.json({
                error: "Too many requests. Please wait a minute."
            }, { status: 429 })
        }
    }



    // redirect already having session but on signup or signin page
    if (pathname.startsWith('/auth/sign-up') || pathname.startsWith('/auth/sign-in')) {
        const session = await getSessionFromRequest(request);

        if (session) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }
    if (pathname.startsWith('/dashboard')) {
        const session = await getSessionFromRequest(request);

        if (!session) {
            return NextResponse.redirect(new URL("/auth/sign-in", request.url));
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        '/dashboard',
        '/auth/sign-in',
        '/auth/sign-up',
        '/auth/forgot-password',
        '/auth/verify-otp',
    ]
}
