import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
    if (!db) {

        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL is missing! Please add it to .env file.");
        }
        const queryClient = postgres(process.env.DATABASE_URL);
        db = drizzle(queryClient, { schema });
    }
    return db;
}

export * from "./schema";
