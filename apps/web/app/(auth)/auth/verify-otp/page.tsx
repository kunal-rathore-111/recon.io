
"use server"

import { VerifyOTPComp } from "@/components/verifyOTPComp";
import { getCreateAccountSession } from "@/lib/session";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";



export default async function VerifyOTP() {

    try {

        const session = await getCreateAccountSession();

        if (!session) redirect('/auth/sign-up?error=Session expired.');

        const email = session.email as string;

        return <VerifyOTPComp email={email} />

    } catch (error) {
        if (isRedirectError(error)) throw error;
        else {
            console.error("Something went wrong in verify-otp page.tsx: ", error);
            redirect('/auth/sign-up?error=Something went wrong');
        }
    }
}