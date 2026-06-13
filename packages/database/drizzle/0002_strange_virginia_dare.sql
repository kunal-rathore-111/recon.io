ALTER TABLE "reconTable" ALTER COLUMN "title" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reconTable" ALTER COLUMN "mission" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reconTable" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reconTable" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "reconTable" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "reconTable" ALTER COLUMN "intelligenceEnabled" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "reconTable" ALTER COLUMN "intelligenceEnabled" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "userFullName" text NOT NULL;