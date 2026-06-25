import z from "zod";


export const urlZod = z.object({
    url: z.url({ message: "Invalid url" })
        .refine((val) => {
            try {
                const parsed = new URL(val);
                return parsed.protocol === "http:" || parsed.protocol === "https:"
            } catch (error) {
                return false;
            }
        }, { message: "Only HTTP and HTTPS links are supported." })
})

