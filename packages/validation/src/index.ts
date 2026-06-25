import type z from "zod";



export * from "./signZod";
export * from "./reconZod";
export * from "./OTPZod";
export * from "./passwordZod";
export * from "./urlZod";
export * from "./reconTypes";


export function zodValidator<T>(schema: z.Schema<T>, input: unknown) {
    return schema.safeParse(input);
}

