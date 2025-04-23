// src/websocket/interfaces/ISocketHandler.ts
import type { Socket } from 'socket.io';

export interface ISocketHandler {
  handleConnection(socket: Socket): void;
  middlewareImplementation?: (socket: Socket, next: any) => void;
}
