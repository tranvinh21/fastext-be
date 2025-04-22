import { HttpServer } from "./server/http";
import Websocket from "./server/websocket";

const httpServer = new HttpServer(3000);
Websocket.getInstance(httpServer);
Websocket.initializeHandlers();




httpServer.Run();

