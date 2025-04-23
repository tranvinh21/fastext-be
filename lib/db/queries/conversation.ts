import { eq } from "drizzle-orm";
import db from "../index";
import {  conversationMembers, conversations, type Conversation, type ConversationMember } from "../schema";

export const getConversation = async (name: string): Promise<Conversation | undefined> => {
	const conversation = await db.select().from(conversations).where(eq(conversations.name, name));
    return conversation[0];
};

export const createConversation = async (name: string, memberIds: number[]): Promise<Conversation | undefined> => {
	const conversation = await db.insert(conversations).values({ name }).returning();
    const conversationId = conversation[0]?.id;
    await db.insert(conversationMembers).values(memberIds.map((id) => ({ conversationId: conversationId, userId: id })));
    return conversation[0];
};

export const getOrCreateConversation = async (name: string, memberIds: number[]): Promise<Conversation | undefined> => {
    const conversation = await getConversation(name);
    if (conversation) {
        return conversation;
    }
    return createConversation(name, memberIds);
};

export const getConversationById = async (conversationId: number): Promise<Conversation | undefined> => {
    const conversation = await db.select().from(conversations).where(eq(conversations.id, conversationId));
    return conversation[0];
};



export const getConversationMembers = async (conversationId: number): Promise<ConversationMember[] | undefined> => {
   return await db.select().from(conversationMembers).where(eq(conversationMembers.conversationId, conversationId));
};

