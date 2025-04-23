import { Router } from "express";
import { registerPlugins } from "../../lib/utils";
import { initPrivateConversationHandler } from "../handler/conversation";
import { AuthMiddleware, validateSchema } from "../middleware";
import { initPrivateConversationSchema } from "../payloads/request/conversation.schema";
import { RoutePlugin } from "./routePlugin";

const router = Router();

const initPrivateConversationPlugin = new RoutePlugin();
initPrivateConversationPlugin.use(
	validateSchema(initPrivateConversationSchema),
);
initPrivateConversationPlugin.use(AuthMiddleware);
initPrivateConversationPlugin.setMethod("post");
initPrivateConversationPlugin.register(
	"/private",
	initPrivateConversationHandler,
);

const conversationRoutes = [initPrivateConversationPlugin];

const conversationRouter = registerPlugins(router, conversationRoutes);

export default conversationRouter;
