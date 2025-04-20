import { Router } from "express";
import { z } from "zod";
import { validateSchema } from "../middleware";
import { RoutePlugin } from "./routePlugin";
import {
  refreshTokenHandler,
  signinHandler,
  signupHandler,
} from "../handler/auth";
import { registerPlugins } from "../lib/utils";
import {
  refreshTokenSchema,
  signinSchema,
  signupSchema,
} from "../schema/request/auth.schema";
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
refreshTokenPlugin.use(validateSchema(refreshTokenSchema));
refreshTokenPlugin.setMethod("post");
refreshTokenPlugin.register("/refresh-token", refreshTokenHandler);

const authRoutes = [signupPlugin, signinPlugin, refreshTokenPlugin];
const authRouter = registerPlugins(router, authRoutes);

export default authRouter;
