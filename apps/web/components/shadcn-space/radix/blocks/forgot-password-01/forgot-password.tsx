"use client"

import { validateOTPAction } from "@/app/actions/authActions";
import { sendOTP } from "@/app/services/emailService";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ValidateOTP } from "@repo/validation";
import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { toast } from "sonner";


const ForgotPasswordComp = () => {
  const [email, setEmail] = useState<string>('');
  const [showUpdateEmailButton, setShowUpdateEmailButton] = useState<boolean>(false);

  const [OTP, setOTP] = useState<string>('');
  const [showOTPInput, setShowOTPInput] = useState<boolean>(false);

  const [isResending, startTransition] = useTransition();


  /*FUNCTIONS */

  const resendOTP = async () => {

    const response = await sendOTP(email, "forgotPassword");
    if (response.error) {
      toast.error(response.error);
      return;
    }
    else {
      toast(response.message);
      setOTP("");
      return;
    }
  }

  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  async function handleSubmit(prevState: any, formData: FormData) {

    if (!email) {
      toast.error("Email input is empty.");
      return;
    }
    else if (!showOTPInput) {
      // send OTP then show otp input
      // send OTP function call here
      const response = await sendOTP(email, 'forgotPassword');

      if (response.error) {
        toast.error(response.error);
        return;
      }
      else {
        toast(response.message);

        setShowOTPInput(true);
        setShowUpdateEmailButton(true);
      }
    }
    else { // if above all fails means validate OTP and redirect to update password form
      const ZodOTPResult = ValidateOTP(OTP);
      if (!ZodOTPResult.success) { // need to update with zod validation
        toast.error(ZodOTPResult.error.issues[0].message);
        return;
      }
      else {
        // make backend call to check OTP
        formData.append('type', 'forgotPassword');
        const response = await validateOTPAction(prevState, formData);
        /*   if (response.error) {
            toast.error(response.error);
          } */
        //working
      }
    }

  }

  return (
    <section className="h-screen bg-foreground dark:bg-background lg:py-20 sm:py-16 py-8 relative flex items-center justify-center">
      <div className="py-10 md:py-20 max-w-lg px-4 sm:px-0 mx-auto w-full">
        <Card className="px-6 py-8 sm:p-12 relative gap-6">
          <CardHeader className="text-center gap-6 p-0">
            <div className="mx-auto">
              <a href="">
                <img
                  src="https://images.shadcnspace.com/assets/logo/logo-icon-black.svg"
                  alt="shadcnspace"
                  className="dark:hidden h-10 w-10"
                />
                <img
                  src="https://images.shadcnspace.com/assets/logo/logo-icon-white.svg"
                  alt="shadcnspace"
                  className="hidden dark:block h-10 w-10"
                />
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl font-medium text-card-foreground">
                Forgot your password?
              </CardTitle>
              <CardDescription className="text-sm font-normal text-muted-foreground">
                Please enter the email address associated with your account and
                we will email you an OTP to reset your password.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">

            <fieldset disabled={isPending || isResending}>

              <form action={formAction}>
                <FieldGroup className="gap-6">
                  <div className="flex flex-col gap-4">
                    <Field className="gap-1.5">
                      <FieldLabel
                        htmlFor="email"
                        className="text-sm text-muted-foreground font-normal
                      justify-between"
                      >
                        Email*
                        {
                          showUpdateEmailButton
                          &&
                          <Button
                            variant={"link"}
                            onClick={() => {
                              setShowOTPInput(false);
                              setShowUpdateEmailButton(false);
                            }}
                          >
                            Update Email
                          </Button>
                        }
                      </FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        readOnly={showOTPInput}
                        placeholder="example@gmail.com"
                        required
                        className="dark:bg-background h-9"
                      />
                    </Field>
                  </div>


                  {/* OTP block */}
                  {
                    showOTPInput &&
                    <FieldGroup className="gap-6">
                      <div className="flex flex-col gap-4">
                        <Field className="gap-1.5">
                          <FieldLabel
                            htmlFor="OTP"
                            className="text-sm text-muted-foreground font-normal justify-between"
                          >
                            OTP*
                            {
                              showUpdateEmailButton
                              &&
                              <Button
                                variant={"link"}
                                onClick={() => {
                                  startTransition(async () => await resendOTP())
                                }}
                              >
                                Resend OTP
                              </Button>
                            }
                          </FieldLabel>
                          <Input
                            placeholder="Enter your OTP"
                            value={OTP}
                            name="otp"
                            type="text"
                            maxLength={6}
                            minLength={6}
                            required
                            onChange={(e) => setOTP(e.target.value)}
                          />
                        </Field>
                      </div>
                    </FieldGroup>
                  }

                  <Field className="gap-4">

                    {showOTPInput ?
                      <Button type="submit" size={"lg"} className="rounded-xl h-10 cursor-pointer hover:bg-black/82"
                      >
                        Submit
                      </Button>
                      :
                      <Button type="submit" size={"lg"} className="rounded-xl h-10 cursor-pointer hover:bg-black/82"
                      >
                        Send OTP
                      </Button>

                    }
                    <Link
                      href={'/auth/sign-in'}
                      className="bg-black hover:bg-black/82
                    rounded-xl
                    text-white p-2 cursor-pointer text-center"
                    >
                      Back to Login
                    </Link>
                  </Field>
                </FieldGroup>
              </form>
            </fieldset>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ForgotPasswordComp;
