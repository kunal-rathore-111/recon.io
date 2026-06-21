
"use server"

import { HomeThemeButton } from "@/components/homeThemeButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { VerifyOTPComp } from "@/components/verifyOTPComp";
import { getSignUpSession } from "@/lib/session";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";



export default async function VerifyOTP() {

    try {

        const session = await getSignUpSession();

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