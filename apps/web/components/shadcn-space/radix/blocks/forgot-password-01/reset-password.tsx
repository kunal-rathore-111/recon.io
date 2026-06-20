"use client"

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
import { PasswordComponent } from "../../../../PasswordComp";
import { useActionState, useState } from "react";
import { passwordValidation } from "@repo/validation";
import { toast } from "sonner";
import { updatePasswordAction } from "@/app/actions/updatePasswordAction";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import Link from "next/link";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

interface ResetPasswordCompProps {
  email: string;
}

const ResetPasswordComp = ({ email }: ResetPasswordCompProps) => {

  const router = useRouter();
  const [state, formAction, isPending] = useActionState(handleSubmit, null);

  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");



  /* functions */
  async function handleSubmit(prevState: any, formData: FormData) {
    // validate password1 using zod then compare both passwords
    const validatePassword1 = passwordValidation(password1);
    if (!validatePassword1.success) {
      toast.error(`${validatePassword1.error.issues[0].message}.`)
      return;
    }

    // then match both
    if (password1 !== password2) {
      toast.error("Both password did not matched.");
      return;
    }

    // then callbackend
    else {
      const response = await updatePasswordAction(formData);

      if (response?.error) {
        toast.error(response.error);
        return;
      }
      else if (response?.message) {
        toast.success(response.message);
        router.push(`/auth/sign-in?email=${email}`);
      }
    }
  }
  return (
    <section className="h-screen bg-black/90 dark:bg-white
     overflow-hidden lg:py-20 sm:py-16 py-8 relative flex items-center justify-center">
      <div className="py-8 md:py-20 max-w-sm md:max-w-lg px-4 md:px-4 mx-auto w-full">
        <Card className="px-6 py-4 sm:p-12 relative gap-8 shadow-xs dark:shadow-md 
dark:shadow-black shadow-white ">
          <CardHeader className="text-center gap-4 p-0">
            <div className="flex gap-2 justify-between w-full items-center">
              <div className='rounded-full border p-2 flex items-center'>
                <Link href="/">
                  <Home size={18} />
                </Link>
              </div>
              <CardTitle className="text-2xl font-medium text-card-foreground">
                Set a new password
              </CardTitle>
              <div className='rounded-full border p-2 flex items-center'>
                <AnimatedThemeToggler />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">

            <fieldset disabled={isPending}>
              <form action={formAction}>
                <FieldGroup className="gap-4">

                  <div className="flex flex-col ">
                    <Field className="gap-1">
                      <FieldLabel
                        htmlFor="email"
                        className="text-sm text-muted-foreground font-normal"
                      >
                        Email
                      </FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        readOnly
                        className="dark:bg-background h-9 opacity-70 cursor-not-allowed"
                      />
                    </Field>
                  </div>

                  <div className="space-y-4">

                    <PasswordComponent
                      label="Password*"
                      placeholder="Password"
                      password={password1}
                      setPassword={setPassword1}
                      shouldShowStrength={false}

                    />

                    <PasswordComponent
                      label="Verify Password*"
                      placeholder="Re-enter the password"
                      password={password2}
                      setPassword={setPassword2} />
                  </div>


                  <Field className="gap-4">
                    <Button type="submit" size={"lg"} className="rounded-xl h-10 cursor-pointer hover:bg-black/82 dark:hover:bg-white/80 dark:bg-white ">
                      Reset Password
                    </Button>
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

export default ResetPasswordComp;
