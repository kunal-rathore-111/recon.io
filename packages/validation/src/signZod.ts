import z from "zod";
import { passwordSchema } from "./passwordZod";



export const signInSchema = passwordSchema.extend({
    email: z.email()
        .min(4, { message: "Email must have atleast 4 characters" })
        .max(199, { message: "The length of email cannot exceed 199 characters" }),

})

export const signUpSchema = signInSchema.extend({
    name: z.string().min(3, { message: "Full name must have atleast 3 characters" })
        .max(1000, { message: "The length of Full name cannot exceed 1000 characters" })
})

interface SignInValidationFnInput {
    email: string, password: string
}
export function signInValidationFn(props: SignInValidationFnInput) {
    return signInSchema.safeParse(props);
}

interface SignUpValidationFnInput extends SignInValidationFnInput {
    name: string
}
export function signUpValidationFn(props: SignUpValidationFnInput) {
    return signUpSchema.safeParse(props);
}