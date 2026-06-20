"use server"

import { signIn } from "@/auth"


interface OAuthSignInDTO {
    authProvider: string
}

export const OAuthSignIn = async (props: OAuthSignInDTO) => {
    await signIn(props.authProvider, { redirectTo: '/dashboard' });
}