import NextAuth from "next-auth"


export const result = NextAuth({
    providers: [Google()],
})

export const handlers: typeof result.handlers = result.handlers;

export const signIn: typeof result.signIn = result.signIn;

export const signOut: typeof result.signOut = result.signOut;
export const auth: typeof result.auth = result.auth;

