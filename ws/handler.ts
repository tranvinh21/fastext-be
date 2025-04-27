import type { Server, Socket } from "socket.io";
import { ChatHandler } from "./handlers/chat.handler";
import { PingHandler } from "./handlers/ping.handler";
import { SubscribeHandler } from "./handlers/subcribe.handler";
import { UserHandler } from "./handlers/user.handler";

export class WsHandler {
	private io!: Server;
	private socket!: Socket;

	constructor(io: Server, socket: Socket) {
		this.io = io;
		this.socket = socket;
		this.initializeHandlers();
	}

	private initializeHandlers() {
		new ChatHandler(this.io, this.socket).handle();
		new PingHandler(this.io, this.socket).handle();
		new SubscribeHandler(this.io, this.socket).handle();
		new UserHandler(this.io, this.socket, this.socket.data.userId).handle();
		// add more handlers here
	}
}
