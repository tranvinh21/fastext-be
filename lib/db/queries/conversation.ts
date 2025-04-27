import { and, eq, exists } from "drizzle-orm";
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
// Join to members table
export const getPrivateConversationByChatKey = async (chatKey: string) => {
	const conversation = await db.query.conversations.findFirst({
		with: {
			members: {
				with: {
					user: {
						columns: {
							password: false,
							createdAt: false,
							updatedAt: false,
							id: false,
						},
					},
				},
				columns: {
					createdAt: false,
					updatedAt: false,
					id: false,
				},
			},
		},
		columns: {
			createdAt: false,
			updatedAt: false,
			deletedAt: false,
		},
		where: eq(conversations.chatKey, chatKey),
	});
	return conversation;
};

export const getGroupConversation = async (): Promise<
	Conversation | undefined
> => {
	const conversation = await db
		.select()
		.from(conversations)
		.where(eq(conversations.isGroup, true));
	return conversation[0];
};

export const getGroupsByUserId = async (userId: number) => {
	const convs = await db.query.conversations.findMany({
		with: {
			members: {
				with: {
					user: {
						columns: {
							password: false,
							createdAt: false,
							updatedAt: false,
						},
					},
				},
				columns: {
					createdAt: false,
					updatedAt: false,
					id: false,
				},
			},
		},
		columns: {
			createdAt: false,
			updatedAt: false,
			deletedAt: false,
		},
		where: and(
			eq(conversations.isGroup, true),
			exists(
				db
					.select()
					.from(conversationMembers)
					.where(
						and(
							eq(conversationMembers.conversationId, conversations.id),
							eq(conversationMembers.userId, userId),
						),
					),
			),
		),
	});

	return convs;
};

export const getConversationsByUserId = async (userId: number) => {
	const convs = await db.query.conversations.findMany({
		with: {
			members: {
				with: {
					user: {
						columns: {
							password: false,
							createdAt: false,
							updatedAt: false,
						},
					},
				},
				columns: {
					createdAt: false,
					updatedAt: false,
					id: false,
				},
			},
		},
		columns: {
			createdAt: false,
			updatedAt: false,
			deletedAt: false,
		},
		where: and(
			exists(
				db
					.select()
					.from(conversationMembers)
					.where(
						and(
							eq(conversationMembers.conversationId, conversations.id),
							eq(conversationMembers.userId, userId),
						),
					),
			),
		),
	});

	return convs;
};
export const createPrivateConversation = async (
	chatKey: string,
): Promise<Conversation | undefined> => {
	const conversation = await createConversation(null, chatKey, false);
	return conversation;
};
export const createGroupConversation = async (
	memberIds: number[],
	name: string,
	chatKey: string,
): Promise<Conversation | undefined> => {
	const conversation = await createConversation(name, chatKey, true);
	for (const memberId of memberIds) {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		await createConversationMember(conversation?.id!, memberId);
	}
	return conversation;
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
	console.log("createConversation: conversation:", conversation);
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

export const getGroupConversationByChatKey = async (chatKey: string) => {
	const conversation = await db.query.conversations.findFirst({
		where: eq(conversations.chatKey, chatKey),
		with: {
			members: {
				with: {
					user: {
						columns: {
							password: false,
							createdAt: false,
							updatedAt: false,
							id: false,
						},
					},
				},
				columns: {
					createdAt: false,
					updatedAt: false,
					id: false,
				},
			},
		},
		columns: {
			createdAt: false,
			updatedAt: false,
			deletedAt: false,
		},
	});
	return conversation;
};
