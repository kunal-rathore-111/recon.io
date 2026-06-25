import { ChatGroq } from "@langchain/groq"
import { magicFillOutputSchema } from "../validator/magic-fill-zod";

export const groqModel = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    temperature: 0,
    apiKey: process.env.GROQ_API
});




export const groqMagicFillModel = groqModel.withStructuredOutput(magicFillOutputSchema);