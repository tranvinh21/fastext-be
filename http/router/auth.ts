import { Router } from "express";
import {
	logoutHandler,
	refreshTokenHandler,
	signinHandler,
	signupHandler,
} from "../handler/auth";
import { registerPlugins } from "../../lib/utils";
import { validateSchema } from "../middleware";
import { signinSchema, signupSchema } from "../payloads/request/auth.schema";
import { RoutePlugin } from "./routePlugin";
const router = Router();

const signupPlugin = new RoutePlugin();
signupPlugin.use(validateSchema(signupSchema));
signupPlugin.setMethod("post");
signupPlugin.register("/signup", signupHandler);

const signinPlugin = new RoutePlugin();
signinPlugin.use(validateSchema(signinSchema));
signinPlugin.setMethod("post");
signinPlugin.register("/signin", signinHandler);

const refreshTokenPlugin = new RoutePlugin();
refreshTokenPlugin.setMethod("post");
// refreshTokenPlugin.use(validateSchema(refreshTokenSchema));
refreshTokenPlugin.register("/refresh-token", refreshTokenHandler);

const logoutPlugin = new RoutePlugin();
logoutPlugin.setMethod("post");
logoutPlugin.register("/signout", logoutHandler);

const authRoutes = [
	signupPlugin,
	signinPlugin,
	refreshTokenPlugin,
	logoutPlugin,
];
const authRouter = registerPlugins(router, authRoutes);

export default authRouter;
