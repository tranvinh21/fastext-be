import { Router } from "express";
import { AuthMiddleware, validateSchema } from "../middleware";
import { RoutePlugin } from "./routePlugin";
import {
  acceptFriendRequestHandler,
  addFriendHandler,
  cancelFriendRequestHandler,
  getFriendRequestsReceivedHandler,
  getFriendRequestsSentHandler,
  getFriendsHandler,
  rejectFriendRequestHandler,
} from "../handler/friend";
import { addFriendSchema } from "../payloads/request/friend.schema";
import { registerPlugins } from "../../lib/utils";
const router = Router();

// GET /api/friend
const getFriendsPlugin = new RoutePlugin();
getFriendsPlugin.use(AuthMiddleware);
getFriendsPlugin.setMethod("get");
getFriendsPlugin.register("/", getFriendsHandler);

// POST /api/friend/add
const addFriendPlugin = new RoutePlugin();
addFriendPlugin.use(AuthMiddleware);
addFriendPlugin.use(validateSchema(addFriendSchema));
addFriendPlugin.setMethod("post");
addFriendPlugin.register("/add", addFriendHandler);

// POST /api/friend/cancel/:requestId
const cancelFriendRequestPlugin = new RoutePlugin();
cancelFriendRequestPlugin.use(AuthMiddleware);
cancelFriendRequestPlugin.setMethod("post");
cancelFriendRequestPlugin.register(
  "/cancel/:requestId",
  cancelFriendRequestHandler,
);

// POST /api/friend/accept/:requestId
const acceptFriendRequestPlugin = new RoutePlugin();
acceptFriendRequestPlugin.use(AuthMiddleware);
acceptFriendRequestPlugin.setMethod("post");
acceptFriendRequestPlugin.register(
  "/accept/:requestId",
  acceptFriendRequestHandler,
);

// POST /api/friend/reject/:requestId
const rejectFriendRequestPlugin = new RoutePlugin();
rejectFriendRequestPlugin.use(AuthMiddleware);
rejectFriendRequestPlugin.setMethod("post");
rejectFriendRequestPlugin.register(
  "/reject/:requestId",
  rejectFriendRequestHandler,
);

// GET /api/friend/requests/received
const getFriendRequestsReceivedPlugin = new RoutePlugin();
getFriendRequestsReceivedPlugin.use(AuthMiddleware);
getFriendRequestsReceivedPlugin.setMethod("get");
getFriendRequestsReceivedPlugin.register(
  "/requests/received",
  getFriendRequestsReceivedHandler,
);

// GET /api/friend/requests/sent
const getFriendRequestsSentPlugin = new RoutePlugin();
getFriendRequestsSentPlugin.use(AuthMiddleware);
getFriendRequestsSentPlugin.setMethod("get");
getFriendRequestsSentPlugin.register(
  "/requests/sent",
  getFriendRequestsSentHandler,
);

const friendRoutes = [
  getFriendsPlugin,
  addFriendPlugin,
  cancelFriendRequestPlugin,
  acceptFriendRequestPlugin,
  rejectFriendRequestPlugin,
  getFriendRequestsReceivedPlugin,
  getFriendRequestsSentPlugin,
];

const friendRouter = registerPlugins(router, friendRoutes);

export default friendRouter;
