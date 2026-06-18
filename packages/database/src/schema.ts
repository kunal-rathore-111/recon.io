import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, jsonb, boolean, varchar, pgEnum, primaryKey, } from "drizzle-orm/pg-core";

// Users Table
export const usersTable = pgTable("users", {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    hashedPassword: text('hashedPassword'),
    image: text('image'),
    isVerified: boolean('isVerified').notNull().default(false),
    createdAt: timestamp("createdAt").defaultNow(),

})


// Accounts Table

export const accountsTable = pgTable("accounts", {
    userId: uuid('userId').references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
    provider: text('provider').notNull(), // not using enum so flexible for later more options
    providerAccountId: text('providerAccountId').notNull()
}, (table) => ({
    accountPk: primaryKey({ columns: [table.provider, table.providerAccountId] })
}))


//  OTP TABLE FOR SIGN-UP (will update with redis)
export const signUp_OTP_Table = pgTable("signUp_OTP", {
    email: text('email').primaryKey(),
    otp: text('otp').notNull(),
    expiresAt: timestamp('expiresAt').notNull()
})

//  OTP TABLE FOR Forgot Password (will update with redis)
export const forgotPassword_OTP_Table = pgTable("forgotPassword_OTP", {
    email: text('email').primaryKey(),
    otp: text('otp').notNull(),
    expiresAt: timestamp('expiresAt').notNull()
})


// Recon Table (The Missions)
export const ReconTable = pgTable("recon", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("userId").references(() => usersTable.id, { onDelete: "cascade" }).notNull(),
    url: text("url").notNull(),
    title: text("title").notNull(),
    mission: text("mission").notNull(),
    type: varchar("type", { length: 50 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    intelligenceEnabled: boolean("intelligenceEnabled").notNull(),
    lastCheckedAt: timestamp("lastCheckedAt").defaultNow(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Recon Snapshots Table - (The History of missions)
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
    user: one(usersTable, {
        fields: [ReconTable.userId],
        references: [usersTable.id],
    }),
    snapshots: many(ReconSnapshotsTable),
}));

export const ReconSnapshotsRelation = relations(ReconSnapshotsTable, ({ one }) => ({
    recon: one(ReconTable, {
        fields: [ReconSnapshotsTable.reconId],
        references: [ReconTable.id],
    }),
}));
