import { randomUUIDv7 } from "bun";
import type { Request, Response } from "express";
import {
	createGroupConversation,
	getGroupConversationByChatKey,
	getGroupsByUserId,
} from "../../lib/db/queries/conversation";
import { getUsersByIds } from "../../lib/db/queries/user";
import { findOrCreatePrivateConversation } from "../service/conversation";

// Initialize a private conversation
export const initializePrivateConversationHandler = async (
	req: Request,
	res: Response,
) => {
	const { chatKey } = req.query as { chatKey: string };
	if (!chatKey) {
		return res.status(400).json({ error: "Chat key is required" });
	}

	const memberIds = chatKey.split("_").map(Number);

	if (memberIds.length !== 2) {
		return res.status(400).json({ error: "Invalid chat key" });
	}

	// Check if all memberIds are valid
	const existingUsers = await getUsersByIds(memberIds);
	if (existingUsers.length !== memberIds.length) {
		return res.status(400).json({ error: "Invalid member IDs" });
	}

	// Find or create conversation
	const conversation = await findOrCreatePrivateConversation(memberIds);
	return res.json(conversation);
};

// Create a group conversation
export const createGroupConversationHandler = async (
	req: Request,
	res: Response,
) => {
	const { memberIds, name } = req.body;
	const existingUsers = await getUsersByIds(memberIds);
	if (existingUsers.length !== memberIds.length) {
		return res.status(400).json({ error: "Invalid member IDs" });
	}
	const conversation = await createGroupConversation(
		memberIds,
		name,
		randomUUIDv7(),
	);	

	return res.json(conversation);
};

// Get all group conversations for a user
export const getGroupConversationHandler = async (
	req: Request,
	res: Response,
) => {
	// biome-ignore lint/style/noNonNullAssertion: <explanation>
	const { userId } = req.user!;
	const conversations = await getGroupsByUserId(userId);
	return res.json(conversations);
};

// Get a group conversation by chat key
export const getGroupConversationByChatKeyHandler = async (
	req: Request,
	res: Response,
) => {
	const { chatKey } = req.params;
	if (!chatKey) {
		return res.status(400).json({ error: "Chat key is required" });
	}
	const conversation = await getGroupConversationByChatKey(chatKey);
	return res.json(conversation);
};
