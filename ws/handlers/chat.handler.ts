import type { Server, Socket } from "socket.io";
import type { MessagePart } from "../../http/types/message";
import { createMessage } from "../../lib/db/queries/message";

interface SendMessagePayload {
	conversationId: number;
	chatKey: string;
	senderId: number;
	parts: MessagePart[];
	replyToMessageId?: number;
	createdAt?: number;
}

export class ChatHandler {
	constructor(
		private io: Server,
		private socket: Socket,
	) {}

	handle() {
		this.socket.on("chat:send", this.handleChatSend.bind(this));
	}

	private async handleChatSend(data: SendMessagePayload) {
		// validate, save to DB, emit to room
		this.io.to(`conversation:${data.chatKey}`).emit("chat:message:receive", {
			...data,
			createdAt: data.createdAt || Date.now(),
		});
		await createMessage(
			data.conversationId,
			data.parts,
			data.senderId,
			data.replyToMessageId,
		);
	}
}
