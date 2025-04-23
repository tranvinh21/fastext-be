import { eq } from "drizzle-orm";
import db from "../index";
import {
	type Conversation,
	type ConversationMember,
	conversationMembers,
	conversations,
} from "../schema";

export const getConversation = async (
	name: string,
): Promise<Conversation | undefined> => {
	const conversation = await db
		.select()
		.from(conversations)
		.where(eq(conversations.name, name));
	return conversation[0];
};
export const getConversationByChatKey = async (
	chatKey: string,
): Promise<Conversation | undefined> => {
	const conversation = await db
		.select()
		.from(conversations)
		.where(eq(conversations.chatKey, chatKey));
	return conversation[0];
};
export const createPrivateConversation = async (
	chatKey: string,
): Promise<Conversation | undefined> => {
	return createConversation(null, chatKey, false);
};
export const createGroupConversation = async (
	memberIds: number[],
	name: string,
	chatKey: string,
): Promise<Conversation | undefined> => {
	return createConversation(name, memberIds, chatKey, true);
};
export const createConversation = async (
	name: string | null,
	chatKey: string,
	isGroup = false,
): Promise<Conversation | undefined> => {
	const conversation = await db
		.insert(conversations)
		.values({ name, chatKey, isGroup })
		.returning();
	return conversation[0];
};
export const getConversationById = async (
	conversationId: number,
): Promise<Conversation | undefined> => {
	const conversation = await db
		.select()
		.from(conversations)
		.where(eq(conversations.id, conversationId));
	return conversation[0];
};
export const getConversationMembers = async (
	conversationId: number,
): Promise<ConversationMember[] | undefined> => {
	return await db
		.select()
		.from(conversationMembers)
		.where(eq(conversationMembers.conversationId, conversationId));
};

export const createConversationMember = async (
	conversationId: number,
	userId: number,
) => {
	await db.insert(conversationMembers).values({
		conversationId,
		userId,
	});
};
