"use server"

import { getSession } from "@/lib/session";
import { getDb, ReconTable } from "@repo/database";
import { eq, and } from "drizzle-orm";

export async function deleteReconAction(reconId: string) {
    const session = await getSession();
    if (!session) return { error: "Unauthorized, please sign in" };

    const userId = session.userId as string;

    try {
        const db = getDb();
        const deleteResponse = await db.delete(ReconTable)
            .where(and(eq(ReconTable.id, reconId), eq(ReconTable.userId, userId)))
            .returning();

        if (deleteResponse.length === 0) {
            return { error: "Target not found or unauthorized" };
        }
        return { success: true };
    } catch (error) {
        console.error("Error in deleteReconAction- ", error);
        return { error: "Failed to delete target, please try again" };
    }
}
