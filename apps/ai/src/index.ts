

import { Hono } from "hono";
import { magicFillApp } from "./routes/magic-fill";

const app = new Hono();

app.get('/v1/', (c) => {
    const message = "On ai server initial route";
    console.log(message);
    return c.json({ message }, { status: 200 });
});

app.route('/v1/magic-fill', magicFillApp);



export default {
    port: 3002,
    fetch: app.fetch
};

