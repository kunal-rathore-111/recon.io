import { ChatOpenRouter } from "@langchain/openrouter";
import { magicFillOutputSchema } from "../validator/magic-fill-zod";



export const openRouterModel = new ChatOpenRouter({
    model: "openrouter/free",
    apiKey: process.env.OPENROUTER_API,
    temperature: 0,
});




export const openRouterMagicFillModel = openRouterModel.withStructuredOutput(magicFillOutputSchema);
