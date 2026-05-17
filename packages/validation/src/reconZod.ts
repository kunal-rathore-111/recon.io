import z from "zod";

export const reconSchema = z.object({
    url: z.string()
        .min(1, { message: "URL is required" })
        .url({ message: "Please enter a valid URL address (must start with http:// or https://)" })
        .max(2048, { message: "URL cannot exceed 2048 characters" }),

    title: z.string()
        .min(1, { message: "title is required" })
        .max(100, { message: "Title cannot exceed 100 characters" }),

    mission: z.string()
        .min(1, { message: "mission is required" })
        .max(2000, { message: "Mission description cannot exceed 2000 characters" }),

    type: z.string()
        .min(1, { message: "type is required" })
        .max(50, { message: "Target type cannot exceed 50 characters" }),

    intelligenceEnabled: z.boolean()
});

export type ReconValidationInput = z.infer<typeof reconSchema>;

export function reconValidationFn(props: ReconValidationInput) {
    return reconSchema.safeParse(props);
}
