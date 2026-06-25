"use client"

import Link from "next/link"
import { useActionState, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useDispatch } from "react-redux"
import { openLegalModal } from "@/lib/store/features/legal/legalSlice"
import { signInAction, signUpAction } from "@/app/actions/authActions"
import { LoaderIcon } from "./animated-icons/LoaderIcon"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { OAuthSignIn } from "@/app/actions/OAuthAction"
import { GithubIcon } from "./animated-icons/GithubIcon"
import { GoogleIcon } from "./animated-icons/GoogleIcon"
import { animateByRef } from "@/lib/animateByRef"
import { DiscordIcon } from "./animated-icons/DiscordIcon"
import { HomeThemeButton } from "./homeThemeButton"
import { Earth } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { passwordSchema, zodValidator } from "@repo/validation"
import { ActionState } from "@/lib/type"
import Image from "next/image"

export function SignForm({
  className,
  mode,
  ...props
}: React.ComponentProps<"div"> & { mode: "signin" | "signup" }) {

  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [isFormPending, setIsFormPending] = useState<boolean>(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<boolean>(false);

  useEffect(() => {
    const error = searchParam.get('error');
    if (error) toast.error(error ?? "Something went wrong, please try again.");
    router.replace(pathname);
  }, [])

  return (
    <div className={cn("flex flex-col gap-6 items-center justify-center", className)} {...props}>
      <div className="text-xl flex items-center gap-1">
        {<Earth className="inline-block" />} Recon-AI
      </div>

      <LogoutNotifyComp />

      <Card className="overflow-hidden p-0 shadow-md w-95 md:min-w-lg shadow-black rounded-sm">
        <CardContent className="p-0">
          <fieldset className="border-2 border-black rounded-sm" disabled={isFormPending || isOAuthLoading}>
            <div className="p-6 md:p-8 space-y-4">
              <HomeThemeButton />

              <FieldGroup className="grid grid-cols-2 items-center">
                <div className="flex flex-col items-center justify-evenly h-full text-center ">
                  <div>
                    <h1 className="text-3xl">
                      {mode === 'signin' ? "Welcome Back" : "Create your account"}
                    </h1>
                    <p className="text-sm text-balance text-muted-foreground">
                      {mode === "signup"
                        ? "Enter your details to create your account"
                        : "Enter your details to login to your account"}
                    </p>
                  </div>
                  <Image height={100} width={100} alt='computer_giphy'
                    src={'/giphy.gif'}
                    className={`${mode === "signin" ? "hidden" : 'md:block'}`}
                  />
                </div>

                <AuthForm mode={mode} onPendingChange={setIsFormPending} />

                <div className="space-y-3 col-span-2 mt-3">
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>
                  <OAuthSection onLoadingChange={setIsOAuthLoading} />
                </div>
              </FieldGroup>

              <FieldDescription className="text-center mt-6">
                {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                <Link
                  href={mode === "signup" ? "/auth/sign-in" : "/auth/sign-up"}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  {mode === "signup" ? "Sign in" : "Create account"}
                </Link>
              </FieldDescription>

            </div>
          </fieldset>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our {" "}
        <button
          className="underline underline-offset-4 cursor-pointer"
          onClick={() => { dispatch(openLegalModal('terms')) }}>Terms of Service
        </button> and {" "}
        <button
          className="underline underline-offset-4 cursor-pointer"
          onClick={() => { dispatch(openLegalModal("privacy")) }}>
          Privacy Policy
        </button>
      </FieldDescription>
    </div >
  )
}

function AuthForm({
  mode,
  onPendingChange
}: {
  mode: "signin" | "signup";
  onPendingChange: (pending: boolean) => void;
}) {
  const [email, setEmail] = useState("")
  const [name, setname] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  async function handleSubmit(prevState: ActionState, formData: FormData): Promise<ActionState> {
    if (mode === "signup" && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return { error: "Passwords do not match" };
    }
    const validatePassword = zodValidator(passwordSchema, { password });
    if (!validatePassword.success) {
      toast.error(validatePassword.error.issues[0].message);
      return { error: validatePassword.error.issues[0].message };
    }

    if (mode === "signup") {
      return await signUpAction(prevState, formData);
    } else {
      return await signInAction(prevState, formData);
    }
  }

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(handleSubmit, null);

  useEffect(() => {
    onPendingChange(isPending);
  }, [isPending, onPendingChange]);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="contents">
      <div className="space-y-5">
        {mode === 'signup' &&
          <Field>
            <FieldLabel htmlFor="name">Full name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              required
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </Field>
        }

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between gap-3">
            <FieldLabel htmlFor="password">
              Password</FieldLabel>
            {mode === "signin" && (
              <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:underline">
                Forgot password?
              </Link>
            )}
          </div>
          <Input
            id="password"
            type="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        {mode === "signup" && (
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field>
        )}
      </div>

      <div className="col-span-2 mt-4">
        <Field>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <LoaderIcon /> : mode === "signup" ? "Create Account" : "Login"}
          </Button>
        </Field>
      </div>
    </form>
  )
}

function OAuthSection({ onLoadingChange }: { onLoadingChange: (loading: boolean) => void }) {
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const googleRef = useRef(null);
  const [githubLoading, setGitHubLoading] = useState<boolean>(false);
  const githubRef = useRef(null);
  const [discordLoading, setDiscordLoading] = useState<boolean>(false);
  const discordRef = useRef(null);

  return (
    <div className="grid grid-cols-3 gap-4 pt-4">
      {[
        {
          ref: githubRef,
          setLoading: setGitHubLoading,
          type: 'github',
          loadingState: githubLoading,
          icon: GithubIcon
        },
        {
          ref: googleRef,
          setLoading: setGoogleLoading,
          type: 'google',
          loadingState: googleLoading,
          icon: GoogleIcon
        },
        {
          ref: discordRef,
          setLoading: setDiscordLoading,
          type: 'discord',
          loadingState: discordLoading,
          icon: DiscordIcon
        }
      ].map((x) => {
        return (
          <Tooltip key={x.type}>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                type="button"
                className="w-full"
                {...animateByRef(x.ref)}
                onClick={async () => {
                  x.setLoading(true);
                  onLoadingChange(true);
                  await OAuthSignIn({ authProvider: x.type as any })
                  x.setLoading(false);
                  onLoadingChange(false);
                }}
              >
                {x.loadingState ? <LoaderIcon /> : <x.icon ref={x.ref} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="capitalize">{x.type} Login</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}

function LogoutNotifyComp() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const hasShown = useRef(false);
  const logout = searchParam.get('logout');

  useEffect(() => {
    if (logout && logout === 'true' && !hasShown.current) {
      hasShown.current = true;
      toast.success('Log out successfully');
      router.replace(pathname);
    }
  }, [logout]);

  return null;
}