
"use server"

import { getSession } from "@/lib/session";
import { getDb, ReconTable } from "@repo/database";
import { desc, eq } from "drizzle-orm";



export interface reconDataResponseType {
    id: string;
    userId: string;
    url: string;
    title: string;
    mission: string;
    type: string;
    status: string;
    intelligenceEnabled: boolean;
    lastCheckedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}


export async function getReconsAction() {
    const session = await getSession();
    if (!session) { return { error: "Unauthorized, Please sign in again." } }

    const userId = session.userId as string;

    try {
        const db = getDb();
        const data = await db.select().from(ReconTable).where(eq(ReconTable.userId, userId)).orderBy(desc(ReconTable.updatedAt));

        return { data, email: session.email as string, name: session.name as string, image: session.image as string };
    } catch (error) {
        console.error("Error in getReconsAction- ", error);
        return {
            error: "Failed to fetch data", email: session.email as string, name: session.name as string,
            image: session.image as string
        }
    }
}