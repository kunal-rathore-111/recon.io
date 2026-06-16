
import NextAuth, { NextAuthResult } from "next-auth";
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { accountsTable, db, sessionsTable, usersTable } from "@repo/database";
export const nextAuth: NextAuthResult = NextAuth({
    adapter: DrizzleAdapter(db, {
        accountsTable: accountsTable,
        sessionsTable: sessionsTable,
        usersTable: usersTable
    }),
    providers: [Google]
})

export const { handlers, signIn, signOut, auth } = nextAuth;


