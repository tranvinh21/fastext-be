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
