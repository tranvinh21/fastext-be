import cors from "cors";
import express, { type Express } from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware";
import APIRoute from "./router";
const app = express();

// Add request logging
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// allow cors
const whitelist = process.env.WHITELIST_DOMAINS?.split(",");

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

app.use(cors(corsOptions));

app.use("/api", APIRoute);

app.use(errorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

export class HttpServer {
	private app: Express;
	private port: number;
	constructor(port: number) {
		this.app = express();
		this.port = port;
	}

	RegisterMiddleware() {
		this.app.use(cors());
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
		this.app.use(cookieParser());
	}

	RegisterRoutes() {
		this.app.use("/api", APIRoute);
	}

	RegisterErrorHandler() {
		this.app.use(errorHandler);
	}

	Run() {
		this.RegisterMiddleware();
		this.RegisterRoutes();
		this.RegisterErrorHandler();
		this.app.listen(this.port, () => {
			console.log(`Server is running on port ${this.port}`);
		});
	}
}
