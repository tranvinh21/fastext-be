import { Router } from "express";
import { RoutePlugin } from "./routePlugin";
import { registerPlugins } from "../../lib/utils";
import { AuthMiddleware, validateSchema } from "../middleware";
import { initConversationHandler } from "../handler/conversation";
import { initConversationSchema } from "../payloads/request/conversation.schema";

const router = Router();

const initConversationPlugin = new RoutePlugin();
initConversationPlugin.use(validateSchema(initConversationSchema));
initConversationPlugin.use(AuthMiddleware);
initConversationPlugin.setMethod("post");
initConversationPlugin.register("/", initConversationHandler);


const conversationRoutes = [
	initConversationPlugin,
];

const conversationRouter = registerPlugins(router, conversationRoutes);

export default conversationRouter;