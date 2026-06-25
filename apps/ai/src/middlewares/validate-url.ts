import type { Context, Next } from "hono";
import { urlZod, zodValidator } from "@repo/validation";


export async function validateUrlMiddleware(c: Context, next: Next) {
    try {
        const { url } = await c.req.json();
        if (!url) return c.json({ success: false, error: "Url not found." }, 404);

        const zodResult = zodValidator(urlZod, { url });
        if (!zodResult.success) {
            return c.json({ success: false, error: zodResult.error.issues[0]?.message }, 400);
        }

        // Zod already confirmed it's a valid http/https URL, so this won't throw
        const cleanUrl = new URL(zodResult.data.url);

        c.set('cleanUrl', cleanUrl);
        await next();

    } catch (error) {
        return c.json({ success: false, error: "Url validation failed." }, 400);
    }
}