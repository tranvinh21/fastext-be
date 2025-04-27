// biome-ignore lint/style/useImportType: <explanation>
import http from "node:http";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import { env } from "../config/env";
import { errorHandler } from "../http/middleware";
import APIRoute from "../http/router";

const whitelist = env.whitelist.domains;
const corsOptions: cors.CorsOptions = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void,
	) => {
		if (
			whitelist &&
			((origin && whitelist.indexOf(origin) !== -1) || !origin)
		) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
};
export class HttpServer {
	private app: Express;
	private server: http.Server | undefined;

	constructor() {
		this.app = express();
		this.registerMiddleware();
	}

	private registerMiddleware() {
		this.app.use((req, res, next) => {
			console.log(`${req.method} ${req.url}`);
			next();
		});

		this.app.use(cors(corsOptions));
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());

		this.app.use("/api", APIRoute);
		this.app.use(errorHandler);
	}

	GetApp() {
		return this.app;
	}
}
