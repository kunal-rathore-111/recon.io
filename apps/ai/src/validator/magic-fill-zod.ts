import { reconTypes } from "@repo/validation";
import z from "zod";


export const magicFillOutputSchema = z.object({
    title: z.string()
        .min(4)
        .max(1000)
        .describe('A clean short title for the data'),
    category: z.enum(reconTypes)
        .describe("The category of the webpage. You MUST pick the single most relevant category from the list. If it doesn't fit any perfectly, use 'Others'."),
    instructions: z.string()
        .min(5).max(4000).describe("Possible task that might be performed on the given data")
});
