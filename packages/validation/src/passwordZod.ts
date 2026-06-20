import z from "zod";

export const passwordSchema = z.object({
    password: z.string().min(6, { message: "Password must have atleast 6 characters" })
        .max(1000, { message: "The length of password cannot exceed 1000 characters" })
        .regex(/[0-9]/, { message: "Password must include a number" })
        .regex(/[a-z]/, { message: "Password must include a small case character" })
        .regex(/[A-Z]/, { message: "Password must include an upper case character" })
        .regex(/[$#@!&^*]/, { message: "Password must include a special case character" })
});

export function passwordValidation(password: string) {
    return passwordSchema.safeParse({ password });
}