import type { Server, Socket } from "socket.io";
import {
	getConversationsByUserId,
	getGroupsByUserId,
} from "../../lib/db/queries/conversation";

interface UserSubscribePayload {
	userId: number;
}

export class SubscribeHandler {
	constructor(
		private io: Server,
		private socket: Socket,
	) {}

	handle() {
		this.socket.on("user:subscribe", this.handleSubscribe.bind(this));
	}
	handleSubscribe(data: UserSubscribePayload) {
		console.log("User subscribe received", data);
		this.subcribeNotification(data);
		this.subcribeChat(data);
	}

	private subcribeNotification(data: UserSubscribePayload) {
		console.log("Subcribe notification received", data);
	}
	private async subcribeChat(data: UserSubscribePayload) {
		// Get all chat rooms for the user
		// Join all chat rooms
		// Store the chat rooms in the user's socket data

		const conversations = await getConversationsByUserId(data.userId);
		const rooms = conversations.map((conversation) => {
			return `conversation:${conversation.chatKey}`;
		});
		this.socket.join(rooms);
	}
}
