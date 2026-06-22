
"use client"
import { Mail } from "lucide-react";
import { HomeThemeButton } from "./homeThemeButton";
import { Card, CardContent } from "./ui/card";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./ui/input-otp";
import { Button } from "./ui/button";
import { sendOTP } from "@/app/services/emailService";
import { useActionState, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { ValidateOTP } from "@repo/validation";
import { validateOTPAction } from "@/app/actions/authActions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LoaderIcon } from "./animated-icons/LoaderIcon";





export function VerifyOTPComp({ email }: { email: string }) {


    const [isResending, startTransition] = useTransition();

    const [otp, setOTP] = useState('');

    const searchParam = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    const [state, formAction, isPending] = useActionState(handleSubmit, null);

    /* functions */
    async function resendOTP() {
        try {
            await sendOTP(email, 'createAccount');
            toast("OTP send successfully");
        } catch (error) {
            toast("Something went wrong, Please try again sending OTP.");
        }
    }

    async function handleSubmit(prevState: any, formData: FormData) {
        const otpValidation = ValidateOTP(otp);
        if (!otpValidation.success) {
            toast.error(otpValidation.error.issues[0].message);
            return;
        }
        else {
            // call backend to verify otp 
            formData.append('email', email);
            formData.append('type', "createAccount");
            return await validateOTPAction(formData);
        }
    }

    useEffect(() => {
        if (searchParam.get('error')) {
            toast.error(searchParam.get('error'));
            router.push(pathname);
        }
    }, [])


    useEffect(() => {
        if (state?.error) {
            toast.error(state.error);
            return;
        }
    }, [state])

    return <div className="h-screen flex items-center justify-center dark:bg-background  bg-zinc-100">
        <Card className="px-5 w-95 md:w-lg py-7 mb-20 pb-20 dark:bg-black shadow-lg dark:shadow-zinc-800 shadow-black/40 border rounded-sm">
            <CardContent >

                <fieldset disabled={isResending || isPending}>
                    <form action={formAction} className="space-y-12 flex flex-col items-center">

                        <div className="w-full">
                            <HomeThemeButton />
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-2xl flex    items-center justify-center gap-2">  Check your email <Mail className="inline-block" size={23} /> </h1>
                            <h2 className="text-md">We sent a verification code to: {email}</h2>
                        </div>
                        <div className="  flex items-center justify-center">
                            <InputOTP
                                maxLength={6}
                                name="otp"
                                value={otp}
                                onChange={(value) => setOTP(value)
                                }
                            >
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
                                {isResending || isPending ?
                                    <LoaderIcon />
                                    :
                                    'Verify Email'}
                            </Button>
                            <div>
                                Didn't receive the email?
                                <Button variant={"link"}
                                    type="button"
                                    onClick={() => startTransition(resendOTP)}
                                >Resend Code</Button>
                            </div>
                        </div>
                    </form>
                </fieldset>
            </CardContent>
        </Card>
    </div >
}