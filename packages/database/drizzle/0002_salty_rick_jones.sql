CREATE TABLE "signUp_OTP" (
	"email" text PRIMARY KEY NOT NULL,
	"otp" text NOT NULL,
	"expiresAt" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "passwordHash" TO "hashedPassword";--> statement-breakpoint
DROP INDEX "userIdIndex";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "createdAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "refresh_token";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "access_token";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "expires_at";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "token_type";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "scope";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "id_token";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "session_state";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "emailVerified";