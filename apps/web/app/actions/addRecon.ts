
"use server"

import { getSession } from "@/lib/session";
import { getDb, ReconTable } from "@repo/database";
import { reconValidationFn } from "@repo/validation";



export async function addReconAction(previousState: any, formData: FormData) {
    const url = formData.get("url") as string;
    const title = formData.get("title") as string;
    const mission = formData.get("mission") as string;
    const type = formData.get("type") as string;
    const intelligenceEnabled = formData.get("intelligenceEnabled") === "true" ? true : false as boolean;


    const validation = reconValidationFn({ url, title, mission, type, intelligenceEnabled })

    if (!validation.success) {
        console.error(validation.error.issues[0].message)
        return { error: validation.error.issues[0].message } //return first error message
    }

    try {
        let status = intelligenceEnabled ? "enabled" : 'disabled';
        const session = await getSession();

        if (!session) return { error: "Unauthorized, please sign in" };

        const userId = session.userId as string;
        const db = getDb();
        const storeResponse = await db.insert(ReconTable).values({
            url, title, mission, type, intelligenceEnabled, status, userId
        }).returning();

        if (storeResponse.length === 0) return { error: "Data not stored, please try again" };
        return { sucess: true }
    } catch (error) {
        console.error("Error in adddReconAction- ", error);
        return { error: "Data not stored, please try again" };
    }
    // console.log(url, title, mission, type, intelligenceEnabled);

}