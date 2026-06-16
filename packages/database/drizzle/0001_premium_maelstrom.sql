ALTER TABLE "reconTable" RENAME TO "recon";--> statement-breakpoint
ALTER TABLE "reconSnapshotsTable" DROP CONSTRAINT "reconSnapshotsTable_reconId_reconTable_id_fk";
--> statement-breakpoint
ALTER TABLE "recon" DROP CONSTRAINT "reconTable_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "reconSnapshotsTable" ADD CONSTRAINT "reconSnapshotsTable_reconId_recon_id_fk" FOREIGN KEY ("reconId") REFERENCES "public"."recon"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recon" ADD CONSTRAINT "recon_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;