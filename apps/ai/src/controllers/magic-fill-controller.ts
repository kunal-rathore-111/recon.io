
import * as cheerio from "cheerio"
import type { Context } from "hono"
import { groqMagicFillModel } from "../models/groq";
import { openRouterMagicFillModel } from "../models/openRouter";


type Variables = { cleanUrl: URL };

export async function magicFillContoller(c: Context<{ Variables: Variables }>) {
    try {
        const cleanUrl = c.get('cleanUrl');

        /* perform websrcapping via scrape.do */
        const SCRAPE_DO_API = process.env.SCRAPE_DO_API;
        const targetURL = encodeURIComponent(cleanUrl.toString());

        const proxyUrl = `https://api.scrape.do/?token=${SCRAPE_DO_API}&url=${targetURL}`;

        const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(20000) }); // 20sec

        // console.log(response)
        if (!response.ok) return c.json({ success: false, error: "Failed to fetch data, Please fill the form manually" }, 502)

        const contentLength = response.headers.get('content-length');

        const maxSize = 2 * 1024 * 1024; // 2mb
        if (contentLength && parseInt(contentLength, 10) > maxSize)
            return c.json({ success: false, error: "Data is too large." }, 502);


        const data = await response.text();

        //console.log(data);

        const $ = cheerio.load(data);
        $('script, style, noscript, svg, iframe').remove();

        const pageTitle = $('title').text();// get the data from body and title tag, convert it in text,
        const pageBody = $('body').text();

        const cleanedData = `${pageTitle} ${pageBody}`.replace(/\s+/g, ' ').trim().substring(0, 25000);//  remove spaces, and trim

        const prompt = `
                    You are a strict metadata extraction system.

                    Your task:
                    Extract structured intelligence from the given webpage text and return ONLY valid JSON that matches the required schema properties.

                    Rules:
                    - Do NOT include any explanation or extra text layout wrappers
                    - Do NOT repeat keys
                    - 'title' must be short, clean, and punchy (max 1 line)
                    - 'category' MUST be exactly one of:
                    'E-commerce', 'SaaS/App', 'Blog/News', 'API Endpoint', 'Custom Web', 'Others'
                    - 'instructions' must be a detailed breakdown (min 5 characters) explaining possible automated task operations, tracking rules, or scraping routines that a web spy agent can execute on this specific data content.
                    - Remove completely irrelevant text like "Skip to main content", navigation sidebars, or footer links
                    - If the webpage content is empty, blocked, or a login wall, IGNORE the text. Look at the URL name, USE YOUR OWN MIND, and populate the fields based on your pre-trained historical knowledge of that domain.
                    - If unsure or it doesn't fit perfectly, choose the closest valid option or "Others"

                    Input:
                    Target URL: ${cleanUrl.toString()}
                    Website Title Tag: ${pageTitle || "UNKNOWN"}
                    Content: ${cleanedData || "EMPTY_BLOCKED_OR_LOGIN_WALL"}
                        `;

        try {
            const aiResponse = await groqMagicFillModel.invoke(prompt);
            return c.json({ success: true, aiResponse });

        } catch (error) { // fallback
            const aiResponse = await openRouterMagicFillModel.invoke(prompt);
            return c.json({ success: true, aiResponse });
        }

    } catch (error) {
        console.error("Error in magicFill controller: ", error);

        return c.json({ success: false, error: "Failed to fetch data, please try again." }, 500)
    }
}