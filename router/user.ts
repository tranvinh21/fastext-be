import { Router } from "express";
import {
  getUserByEmailHandler,
  getUserByIdHandler,
  getUserByNameHandler,
} from "../handler/user";
import { AuthMiddleware } from "../middleware";
import { RoutePlugin } from "./routePlugin";
import { registerPlugins } from "../lib/utils";

const router = Router();

// GET /api/user/name/:name
const getUserByNamePlugin = new RoutePlugin();
getUserByNamePlugin.use(AuthMiddleware);
getUserByNamePlugin.setMethod("get");
getUserByNamePlugin.register("/name/:name", getUserByNameHandler);

// GET /api/user/email/:email
const getUserByEmailPlugin = new RoutePlugin();
getUserByEmailPlugin.use(AuthMiddleware);
getUserByEmailPlugin.setMethod("get");
getUserByEmailPlugin.register("/email/:email", getUserByEmailHandler);

// GET /api/user/:userId
const getUserByIdPlugin = new RoutePlugin();
getUserByIdPlugin.use(AuthMiddleware);
getUserByIdPlugin.setMethod("get");
getUserByIdPlugin.register("/:userId", getUserByIdHandler);

const userRoutes = [getUserByNamePlugin];
const userRouter = registerPlugins(router, userRoutes);

export default userRouter;
