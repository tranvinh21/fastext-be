import { Router } from "express";
import { RoutePlugin } from "./routePlugin";
import { registerPlugins } from "../../lib/utils";
import { AuthMiddleware, validateQuery, validateSchema } from "../middleware";
import { getMessageQuerySchema, sendMessageSchema } from "../payloads/request/message.schema";
import { deleteMessageHandler, getMessagesHandler, sendMessageHandler } from "../handler/message";

const router = Router();

const messagePlugin = new RoutePlugin();
messagePlugin.use(validateQuery(getMessageQuerySchema));
messagePlugin.use(AuthMiddleware);
messagePlugin.setMethod("get");
messagePlugin.register("/", getMessagesHandler);

const deleteMessagePlugin = new RoutePlugin();
deleteMessagePlugin.use(AuthMiddleware);
deleteMessagePlugin.setMethod("delete");
deleteMessagePlugin.register("/:messageId", deleteMessageHandler);

const sendMessagePlugin = new RoutePlugin();
sendMessagePlugin.use(validateSchema(sendMessageSchema));
sendMessagePlugin.use(AuthMiddleware);
sendMessagePlugin.setMethod("post");
sendMessagePlugin.register("/", sendMessageHandler);


const messageRoutes = [
	messagePlugin,
	deleteMessagePlugin,
	sendMessagePlugin,
];

const messageRouter = registerPlugins(router, messageRoutes);

export default messageRouter;