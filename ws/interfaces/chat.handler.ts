export interface ChatSendDto {
	conversationId: string;
	senderId: string;
	content: string;
}

export interface ChatSeenDto {
	conversationId: string;
	senderId: string;
}
