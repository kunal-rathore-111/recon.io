import { Hono } from "hono";
import { validateUrlMiddleware } from "../middlewares/validate-url";
import { magicFillContoller } from "../controllers/magic-fill-controller";


export const magicFillApp = new Hono();




magicFillApp.post('/recon', validateUrlMiddleware, magicFillContoller);
