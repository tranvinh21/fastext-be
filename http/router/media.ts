import { Router } from "express";
import { registerPlugins } from "../../lib/utils";
import { signUrlHandler, uploadHandler } from "../handler/media";
import { AuthMiddleware } from "../middleware";
import { RoutePlugin } from "./routePlugin";

const router = Router();

const signUrlPlugin = new RoutePlugin();
signUrlPlugin.setMethod("post");
signUrlPlugin.register("/sign", signUrlHandler);

const uploadPlugin = new RoutePlugin();
uploadPlugin.setMethod("post");
// uploadPlugin.use(AuthMiddleware);
uploadPlugin.register("/upload", uploadHandler);

const mediaRoutes = [signUrlPlugin, uploadPlugin];
const mediaRouter = registerPlugins(router, mediaRoutes);
export default mediaRouter;
