ALTER TABLE "forgotPassword_OTP" ADD COLUMN "attempts" serial DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "signUp_OTP" ADD COLUMN "attempts" serial DEFAULT 0 NOT NULL;