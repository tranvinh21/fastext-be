import { createServer } from "node:http";
import { Server } from "socket.io";
import { HttpServer } from "./server/http";
import { WsModule } from "./server/ws";

const expressServer = new HttpServer();
const httpServer = createServer(expressServer.GetApp());

const ioServer = new Server(httpServer);
new WsModule(ioServer);

httpServer.listen(3000, () => {
	console.log("Server is running on port 3000");
});
