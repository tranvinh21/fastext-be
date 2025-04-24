import { Router } from "express";
import { registerPlugins } from "../../lib/utils";
import { getViewUrlsHandler, signUrlHandler } from "../handler/media";
import { AuthMiddleware } from "../middleware";
import { RoutePlugin } from "./routePlugin";

const router = Router();

const signUrlPlugin = new RoutePlugin();
signUrlPlugin.setMethod("post");
signUrlPlugin.use(AuthMiddleware);
signUrlPlugin.register("/sign", signUrlHandler);

const getViewUrlsPlugin = new RoutePlugin();
getViewUrlsPlugin.setMethod("post");
getViewUrlsPlugin.use(AuthMiddleware);
getViewUrlsPlugin.register("/get-view-urls", getViewUrlsHandler);

const mediaRoutes = [signUrlPlugin, getViewUrlsPlugin];
const mediaRouter = registerPlugins(router, mediaRoutes);
export default mediaRouter;
