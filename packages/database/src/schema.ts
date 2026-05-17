import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, jsonb, boolean, varchar } from "drizzle-orm/pg-core";

// Users Table
export const UsersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    name: text("name"),
    avatarUrl: text("avatarUrl"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Recon Table (The Missions)
export const ReconTable = pgTable("reconTable", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").references(() => UsersTable.id, { onDelete: "cascade" }).notNull(),
    url: text("url").notNull(),
    title: text("title"),
    mission: text("mission"),
    type: varchar("type", { length: 50 }),
    status: varchar("status", { length: 50 }).default("active"),
    intelligenceEnabled: boolean("intelligenceEnabled").default(true),
    lastCheckedAt: timestamp("lastCheckedAt").defaultNow(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Recon Snapshots Table (The History of missions)
export const ReconSnapshotsTable = pgTable("reconSnapshotsTable", {
    id: uuid("id").primaryKey().defaultRandom(),
    reconId: uuid("reconId").references(() => ReconTable.id, { onDelete: "cascade" }).notNull(),
    data: jsonb("data"),       // Extracted Raw Intel
    insight: text("insight"),  // Intelligence Analysis by AI
    status: varchar("status", { length: 50 }), // CHANGE / NO CHANGE (keeping varchar so can be anything like average, no change, updated etc.)
    createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// --- RELATIONS ---
export const ReconRelation = relations(ReconTable, ({ one, many }) => ({
    user: one(UsersTable, {
        fields: [ReconTable.userId],
        references: [UsersTable.id],
    }),
    snapshots: many(ReconSnapshotsTable),
}));

export const ReconSnapshotsRelation = relations(ReconSnapshotsTable, ({ one }) => ({
    recon: one(ReconTable, {
        fields: [ReconSnapshotsTable.reconId],
        references: [ReconTable.id],
    }),
}));
