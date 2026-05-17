CREATE TABLE "reconSnapshotsTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reconId" uuid NOT NULL,
	"data" jsonb,
	"insight" text,
	"status" varchar(50),
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reconTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"url" text NOT NULL,
	"title" text,
	"mission" text,
	"type" varchar(50),
	"status" varchar(50) DEFAULT 'active',
	"intelligenceEnabled" boolean DEFAULT true,
	"lastCheckedAt" timestamp DEFAULT now(),
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatarUrl" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "reconSnapshotsTable" ADD CONSTRAINT "reconSnapshotsTable_reconId_reconTable_id_fk" FOREIGN KEY ("reconId") REFERENCES "public"."reconTable"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reconTable" ADD CONSTRAINT "reconTable_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;