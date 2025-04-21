import { Router } from "express";
import { z } from "zod";
import {
	refreshTokenHandler,
	signinHandler,
	signupHandler,
} from "../handler/auth";
import { registerPlugins } from "../lib/utils";
import { validateSchema } from "../middleware";
import {
	refreshTokenSchema,
	signinSchema,
	signupSchema,
} from "../schema/request/auth.schema";
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

const authRoutes = [signupPlugin, signinPlugin, refreshTokenPlugin];
const authRouter = registerPlugins(router, authRoutes);

export default authRouter;
