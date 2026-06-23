import { Hono } from "hono";
import * as cheerio from 'cheerio'


export const magicFillApp = new Hono();


magicFillApp.post('/recon-io', async (c) => {

    try {
        const { url } = await c.req.json();
        if (!url) return c.json({ success: false, error: "Url not found." }, 404);

        //validate url
        let cleanUrl: URL;
        try {
            cleanUrl = new URL(url.trim());
        } catch (error) {
            return c.json({ success: false, error: "Invalid URL format provided." }, 400)
        }

        if (!cleanUrl.protocol.startsWith('http:') && !cleanUrl.protocol.startsWith('https:'))
            return c.json({ success: false, error: "Only HTTP or HTTPS protocols are permitted." }, 400);



        /* perform websrcapping via scrape.do */
        const SCRAPE_DO_API = process.env.SCRAPE_DO_API;
        const targetURL = cleanUrl;

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
        const cleanedData = `${pageTitle} ${pageBody}`.replace(/\s+/g, '').trim();//  remove spaces, and trim

        console.log('\n\n\n\nCLEANED', cleanedData.substring(0, 10000), '\n\n\n\n');

        return c.json({ success: true, message: 'Hi there' });

    } catch (error) {
        console.error("Error in magicFill recon-io: ", error);
        return c.json({ success: false, error: "Failed to fetch data, please try again." }, 500)
    }
})