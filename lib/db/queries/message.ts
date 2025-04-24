import { and, desc, eq } from "drizzle-orm";
import type { MessagePart } from "../../../http/types/message";
import db from "../index";
import {
	type Message,
	messageStatuses,
	messages as messagesDB,
} from "../schema";

export interface GetMessagesQuery {
	conversationId?: string;
	limit?: string;
	offset?: string;
}

export const getMessages = async ({
	conversationId,
	limit,
	offset,
}: GetMessagesQuery) => {
	const filter = [];
	if (conversationId) {
		filter.push(eq(messagesDB.conversationId, Number.parseInt(conversationId)));
	}
	const messageQuery = db
		.select()
		.from(messagesDB)
		.where(and(...filter))
		.orderBy(desc(messagesDB.createdAt));
	if (limit) {
		messageQuery.limit(Number.parseInt(limit));
	}
	if (offset) {
		messageQuery.offset(Number.parseInt(offset));
	}
	const messages = await messageQuery;
	return messages;
};

export const getMessageById = async (
	messageId: number,
): Promise<Message | undefined> => {
	const message = await db
		.select()
		.from(messagesDB)
		.where(eq(messagesDB.id, messageId));
	return message[0];
};

export const deleteMessage = async (messageId: number) => {
	await db
		.update(messagesDB)
		.set({ deletedAt: new Date() })
		.where(eq(messagesDB.id, messageId));
};

export const createMessage = async (
	conversationId: number,
	parts: MessagePart[],
	userId: number,
	replyToMessageId?: number,
) => {
	const newMessage = await db
		.insert(messagesDB)
		.values({ conversationId, parts, userId, replyToMessageId })
		.returning();
	return newMessage[0];
};

export const createMessageStatus = async (
	messageId: number,
	userId: number,
	status: "sent" | "delivered" | "read",
) => {
	await db
		.insert(messageStatuses)
		.values({ messageId, userId, status })
		.returning();
};
