"use client"

import Link from "next/link"
import { startTransition, useActionState, useEffect, useRef, useState } from "react"
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
import { Home } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { OAuthSignIn } from "@/app/actions/OAuthAction"
import { GithubIcon } from "./animated-icons/GithubIcon"
import { GoogleIcon } from "./animated-icons/GoogleIcon"
import { animateByRef } from "@/lib/animateByRef"
import { DiscordIcon } from "./animated-icons/DiscordIcon"




export function SignForm({
  className,
  mode,
  ...props
}: React.ComponentProps<"div"> & { mode: "signin" | "signup" }) {

  const searchParam = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [email, setEmail] = useState("")
  const [name, setname] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("");

  const dispatch = useDispatch();


  const [state, formAction, isPending] = useActionState(mode === "signup" ? signUpAction : signInAction, null);

  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const googleRef = useRef(null);
  const [githubLoading, setGitHubLoading] = useState<boolean>(false);
  const githubRef = useRef(null);
  const [discordLoading, setDiscordLoading] = useState<boolean>(false);
  const discordRef = useRef(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    // need to add signin/up input validation using signzod and signup zod

    // now signin or signup call
    const formData = new FormData(e.currentTarget);

    startTransition(() => formAction(formData))
  }


  useEffect(() => {
    const error = searchParam.get('error');
    if (error) toast.error("Something went wrong, please try again.");
    router.replace(pathname);
  }, [])


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>

      <LogoutNotifyComp />

      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2 ">
          <fieldset disabled={googleLoading || githubLoading || discordLoading || isPending}>
            <div className="p-6 md:p-8 space-y-4">

              <form onSubmit={handleSubmit}>

                <FieldGroup>
                  <Link href="/"><Home size={18} /></Link>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">
                      {mode === "signup" ? "Create your account" : "Welcome back"}
                    </h1>
                    <p className="text-sm text-balance text-muted-foreground">
                      {mode === "signup"
                        ? "Enter your details below to create your account"
                        : "Enter your email below to login to your account"}
                    </p>
                  </div>
                  {mode === 'signup' &&
                    <Field>
                      <FieldLabel htmlFor="name">
                        Full name
                      </FieldLabel>
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
                    <div className={cn("grid gap-4", mode === "signup" && "md:grid-cols-2")}>
                      <Field>
                        <div className="flex items-center justify-between">
                          <FieldLabel htmlFor="password">Password</FieldLabel>
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
                          <FieldLabel htmlFor="confirm-password">
                            Confirm Password
                          </FieldLabel>
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
                    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                    {mode === "signup" && (
                      <FieldDescription>
                        Must be at least 6 characters long.
                      </FieldDescription>
                    )}
                    {
                      state?.error && <p className="text-red-500">
                        {state.error}
                      </p>
                    }
                  </Field>

                  <Field>
                    <Button type="submit" className="w-full" disabled={isPending}>
                      {isPending ? <LoaderIcon /> :
                        mode === "signup" ?
                          "Create Account" : "Login"}
                    </Button>
                  </Field>
                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                    Or continue with
                  </FieldSeparator>
                </FieldGroup>
              </form>

              <div className="grid grid-cols-3 gap-4 ">
                {/* Github */}
                <Button variant="outline" type="button" className="w-full"
                  {...animateByRef(githubRef)}
                  onClick={
                    async () => {
                      setGitHubLoading(true);
                      await OAuthSignIn({ authProvider: "github" })
                      setGitHubLoading(false);
                    }}
                >
                  {githubLoading ?
                    <LoaderIcon />
                    :

                    <GithubIcon ref={githubRef} />
                  }
                </Button>

                {/* Google */}

                <Button variant="outline" type="submit" className="w-full"
                  {...animateByRef(googleRef)}
                  onClick={
                    async () => {
                      setGoogleLoading(true);
                      await OAuthSignIn({ authProvider: "google" })
                      setGoogleLoading(false);
                    }}
                >
                  {googleLoading ?
                    <LoaderIcon />
                    :
                    <GoogleIcon ref={googleRef} />
                  }
                </Button>

                {/* discord */}
                <Button variant="outline" type="button" className="w-full"
                  {...animateByRef(discordRef)}
                  onClick={
                    async () => {
                      setDiscordLoading(true);
                      await OAuthSignIn({ authProvider: "discord" })
                      setDiscordLoading(false);
                    }}>
                  {discordLoading ?
                    <LoaderIcon />
                    :
                    <DiscordIcon ref={discordRef} />
                  }
                </Button>

              </div>
              <FieldDescription className="text-center">
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


          <div className="relative hidden bg-muted md:block">
            <img
              src="/auth-bg.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card >

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our  {" "}
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