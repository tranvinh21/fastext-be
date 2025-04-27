import type { Server, Socket } from "socket.io";

export class UserHandler {
	constructor(
		private io: Server,
		private socket: Socket,
		private userId: number,
	) {}

	handle() {
		this.socket.on(`user:${this.userId}`, this.handleUser.bind(this));
	}
	handleUser(data: any) {
		console.log("User", data);
	}
}
