
"use client"

import { HomeThemeButton } from "@/components/homeThemeButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";



export default function VerifyOTP() {

    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    return <div className="h-screen flex items-center justify-center dark:bg-background  bg-zinc-100">
        <Card className="px-5 min-w-lg py-7 mb-20 pb-10 dark:bg-black shadow-lg dark:shadow-zinc-800 shadow-black/40 border rounded-sm">
            <CardContent className="space-y-6 flex flex-col items-center">
                <div className="w-full">
                    <HomeThemeButton />
                </div>
                <div className="space-y-3">
                    <h1 className="text-2xl flex items-center justify-center gap-2">  Check your email <Mail className="inline-block" size={23} /> </h1>
                    <h2 className="text-md">We sent a verification code to: {email}</h2>
                </div>
                <div className=" border-black flex items-center justify-center">
                    <InputOTP maxLength={6} >
                        <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                        </InputOTPGroup>
                    </InputOTP>
                </div>
                <div className="space-y-3">
                    <Button className="w-full">
                        Verify Email
                    </Button>
                    <div>
                        Didn't receive the email?
                        <Button variant={"link"}>Resend Code</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div >
}