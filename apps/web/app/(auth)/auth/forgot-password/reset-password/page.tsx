import ResetPasswordComp from "@/components/shadcn-space/radix/blocks/forgot-password-01/reset-password";
import { getForgotPasswordSession } from "@/lib/session"
import { redirect } from "next/navigation";



export default async function ResetPassword() {
    // validate cookie if correct then keep else redirect to /auth/forgot-password

    const forgotPasswordSession = await getForgotPasswordSession();

    if (!forgotPasswordSession) redirect(`/auth/forgot-password?error=${"Session expired. Please request a new OTP."}`);

    return <ResetPasswordComp email={forgotPasswordSession.email as string} />
}