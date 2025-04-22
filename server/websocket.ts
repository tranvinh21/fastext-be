import { Server, Socket } from 'socket.io';
import type { HttpServer } from './http';

class Websocket {
   private static io: Server;
   private static instance: Websocket;
   private static socketHandlers: Array<any> = [];
   private constructor(httpServer: HttpServer) {
      Websocket.io = new Server(httpServer.GetServer());
   }

   public static getInstance(httpServer: HttpServer): Websocket {
       if (!Websocket.instance) {
           Websocket.instance = new Websocket(httpServer);
       }

       return Websocket.instance;
   }

   public static initializeHandlers() {
      if (Websocket.socketHandlers.length === 0) {
         console.log('No socket handlers found');
         return;
      }
      Websocket.socketHandlers.forEach(element => {
         let namespace = Websocket.io.of(element.path, (socket: Socket) => {
            element.handler.handleConnection(socket);
         });

         if (element.handler.middlewareImplementation) {
            namespace.use(element.handler.middlewareImplementation);
         }
      });
   }
   public addHandler(path: string, handler: any) {
      Websocket.socketHandlers.push({ path, handler });
   }
}

export default Websocket;