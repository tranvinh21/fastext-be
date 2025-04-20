import express from "express";
import APIRoute from "./router";
import cors from "cors";
import { errorHandler } from "./middleware";
const app = express();

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
};
app.use(cors(corsOptions));

app.use("/api", APIRoute);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
