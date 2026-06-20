"use server"

import { signIn } from "@/auth"


interface OAuthSignInDTO {
    authProvider: 'discord' | 'google' | 'github'
}

export const OAuthSignIn = async (props: OAuthSignInDTO) => {
    await signIn(props.authProvider, { redirectTo: '/dashboard' });
}