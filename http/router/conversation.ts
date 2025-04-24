import { Router } from "express";
import { registerPlugins } from "../../lib/utils";
import {
	createGroupConversationHandler,
	getGroupConversationByChatKeyHandler,
	getGroupConversationHandler,
	initializePrivateConversationHandler,
} from "../handler/conversation";
import { AuthMiddleware, validateSchema } from "../middleware";
import { createGroupConversationSchema } from "../payloads/request/conversation.schema";
import { RoutePlugin } from "./routePlugin";

const router = Router();

// Private conversation
// Check if is not exist will create new one
const initPrivateConversationPlugin = new RoutePlugin();
initPrivateConversationPlugin.use(AuthMiddleware);
initPrivateConversationPlugin.setMethod("get");
initPrivateConversationPlugin.register(
	"/private",
	initializePrivateConversationHandler,
);

// Group conversation
const createGroupConversationPlugin = new RoutePlugin();
createGroupConversationPlugin.use(
	validateSchema(createGroupConversationSchema),
);
createGroupConversationPlugin.use(AuthMiddleware);
createGroupConversationPlugin.setMethod("post");
createGroupConversationPlugin.register(
	"/group",
	createGroupConversationHandler,
);

const getGroupConversationPlugin = new RoutePlugin();
getGroupConversationPlugin.use(AuthMiddleware);
getGroupConversationPlugin.setMethod("get");
getGroupConversationPlugin.register("/group", getGroupConversationHandler);

const getGroupConversationByIdPlugin = new RoutePlugin();
getGroupConversationByIdPlugin.use(AuthMiddleware);
getGroupConversationByIdPlugin.setMethod("get");
getGroupConversationByIdPlugin.register(
	"/group/:chatKey",
	getGroupConversationByChatKeyHandler,
);

const conversationRoutes = [
	initPrivateConversationPlugin,
	createGroupConversationPlugin,
	getGroupConversationPlugin,
	getGroupConversationByIdPlugin,
];

const conversationRouter = registerPlugins(router, conversationRoutes);

export default conversationRouter;
