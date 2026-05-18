
"use server"

import { getSession } from "@/lib/session";
import { db, ReconTable } from "@repo/database";
import { and, eq } from "drizzle-orm";




export async function ToggleIntelligenceAction(reconId: string, isEnabled: boolean) {

    const session = await getSession();
    if (!session) return { error: "Unauthorized, please login again." }
    const userId = session.userId as string;
    try {

        const updateResponse = await db.update(ReconTable).set({ intelligenceEnabled: isEnabled }).where(and(
            eq(ReconTable.userId, userId),
            eq(ReconTable.id, reconId))).returning();

        if (updateResponse.length === 0) return { error: "Target recon not found." }

        return { sucess: true }

    } catch (error) {
        console.error("Error in ToggleIntelligenceAction- ", error);
        return { error: "Failed to toggle the Intelligence, Please try again." }
    }
}