import type { Server, Socket } from "socket.io";

export class PingHandler {
	constructor(
		private io: Server,
		private socket: Socket,
	) {}

	handle() {
		this.socket.on("ping", this.handlePing.bind(this));
	}

	private handlePing() {
		console.log("Ping received");
		this.socket.emit("pong", "pong pong");
	}
}
