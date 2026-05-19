"use server"

import { getSession } from "@/lib/session";
import { db, ReconSnapshotsTable } from "@repo/database";
import { desc, eq } from "drizzle-orm";



export async function fetchReconHistoryAction(recondId: string) {

    if (!recondId) return { error: "Recon/TargetId not found" };
    const session = await getSession();
    if (!session) return {
        error: "Unauthorized. Please sign in."
    }

    try {

        const historyData = await db.select().from(ReconSnapshotsTable).where(eq(ReconSnapshotsTable.reconId, recondId)).orderBy(desc(ReconSnapshotsTable.createdAt));
        return { historyData };

    } catch (error) {
        console.error("Error in fetchReconHistoryAction- ", error)
        return { error: "Something went wrong while fetching history, Please try again later." }
    }

}