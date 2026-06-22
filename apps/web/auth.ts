import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Discord from "next-auth/providers/discord"
import Github from "next-auth/providers/github"
import { accountsTable, getDb, usersTable } from "@repo/database"
import { and, eq } from "drizzle-orm"
import { createSession } from "./lib/session"


export const result = NextAuth({
    providers: [Google, Discord, Github],
    pages: {
        error: '/auth/sign-in'
    },
    callbacks: {
        async signIn({ user, account }) {
            try {
                const db = getDb();
                if (!user.email || !account) return false;
                else {
                    // check in accounts-> if present set userId, else check in usersTable if there present create new in accountsTable, if not present in both then create in both and set userId
                    let userId: string

                    const existingUser = await db.select().from(accountsTable).
                        where(and
                            (
                                eq(accountsTable.provider, account.provider),
                                eq(accountsTable.providerAccountId, account.providerAccountId)
                            )
                        ).
                        limit(1);

                    if (existingUser.length) userId = existingUser[0].userId;

                    else { // not present in accountsTable

                        const existingUser = await db.select().
                            from(usersTable).
                            where(
                                eq(usersTable.email, user.email)).
                            limit(1);

                        if (existingUser.length) userId = existingUser[0].id;

                        else { // not present in usersTable too 
                            const newUser = await db.insert(usersTable).values({
                                email: user.email,
                                name: user.name || "unknown",
                                isVerified: true,
                                image: user.image,
                            }).returning();

                            userId = newUser[0].id;
                        }
                        // create entry in accounts table in both cases (present in usersTable, not present in usersTable)
                        await db.insert(accountsTable).values({
                            userId: userId,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId
                        })
                    }
                    // finally create session
                    await createSession({ email: user.email, userId, name: user.name || "unknown", image: user.image ?? "" });

                    return true;
                }
            } catch (error) {
                console.error("[OAUTH failed]: ", error);
                return false;
            }
        }
    }
})

export const handlers: typeof result.handlers = result.handlers;

export const signIn: typeof result.signIn = result.signIn;

export const signOut: typeof result.signOut = result.signOut;
export const auth: typeof result.auth = result.auth;

