import type { Server, Socket } from "socket.io";
import { WsHandler } from "../ws/handler";

export class WsModule {
	constructor(private io: Server) {
		this.io.on("connection", (socket: Socket) => {
			console.log("New connection", socket.id);
			socket.on("disconnect", () => {
				console.log("User disconnected", socket.id);
			});
			new WsHandler(this.io, socket);
		});
		console.log("WsModule initialized");
	}

	getIo() {
		return this.io;
	}
}
