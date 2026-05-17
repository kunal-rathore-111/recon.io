import { NextRequest, NextResponse } from "next/server";
import { checkJWT } from "./lib/session";



const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/sign/sign-in', '/sign/sign-up'];

export async function proxy(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));

    const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

    const token = request.cookies.get('session')?.value;
    //if token present then check valid or not
    const session = token ? await checkJWT(token) : null;

    //if token is valid and on sign page then redirect to dashboard
    if (session && isPublicRoute) return NextResponse.redirect(new URL('/dashboard', request.nextUrl));

    // or if no token and also at dasboard redirect to sign
    if (!session && isProtectedRoute) return NextResponse.redirect(new URL("/sign/sign-in", request.nextUrl))

    return NextResponse.next();
}