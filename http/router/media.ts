import { Router } from "express";
import { registerPlugins } from "../../lib/utils";
import { signUrlHandler } from "../handler/media";
import { AuthMiddleware } from "../middleware";
import { RoutePlugin } from "./routePlugin";

const router = Router();

const signUrlPlugin = new RoutePlugin();
signUrlPlugin.setMethod("post");
signUrlPlugin.use(AuthMiddleware);
signUrlPlugin.register("/sign", signUrlHandler);

const mediaRoutes = [signUrlPlugin];
const mediaRouter = registerPlugins(router, mediaRoutes);
export default mediaRouter;
