import z from "zod";


export const signInSchema = z.object({
    email: z.email()
        .min(4, { message: "Email must have atleast 4 characters" })
        .max(199, { message: "The length of email cannot exceed 199 characters" }),
    password: z.string().min(6, { message: "password must have atleast 6 characters" })
        .max(1000, { message: "The length of password cannot exceed 1000 characters" })
        .regex(/[0-9]/, { message: "password must include a number" })
        .regex(/[a-z]/, { message: "password must include a small case character" })
        .regex(/[A-Z]/, { message: "password must include an upper case character" })
        .regex(/[$#@!&^*]/, { message: "password must include a special case character" })
})

export const signUpSchema = signInSchema.extend({
    userFullName: z.string().min(3, { message: "Full name must have atleast 3 characters" })
        .max(1000, { message: "The length of Full name cannot exceed 1000 characters" })
})

interface SignInValidationFnInput {
    email: string, password: string
}
export function signInValidationFn(props: SignInValidationFnInput) {
    return signInSchema.safeParse(props);
}

interface SignUpValidationFnInput extends SignInValidationFnInput {
    userFullName: string
}
export function signUpValidationFn(props: SignUpValidationFnInput) {
    return signUpSchema.safeParse(props);
}