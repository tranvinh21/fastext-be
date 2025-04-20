import express from "express";
import APIRoute from "./router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.use("/api", APIRoute);

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
