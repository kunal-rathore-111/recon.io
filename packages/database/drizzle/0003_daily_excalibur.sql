CREATE TABLE "forgotPassword_OTP" (
	"email" text PRIMARY KEY NOT NULL,
	"otp" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL
);
