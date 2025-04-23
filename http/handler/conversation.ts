import type { Request, Response } from "express";
import {
	createPrivateConversation,
	getConversationByChatKey,
} from "../../lib/db/queries/conversation";
import { getUsersByIds } from "../../lib/db/queries/user";
import { findOrCreatePrivateConversation } from "../service/conversation";

export const initPrivateConversationHandler = async (
	req: Request,
	res: Response,
) => {
	const { memberIds } = req.body;
	const existingUsers = await getUsersByIds(memberIds);
	if (existingUsers.length !== memberIds.length) {
		return res.status(400).json({ error: "Invalid member IDs" });
	}
	const conversation = await findOrCreatePrivateConversation(memberIds);
	res.json(conversation);
};
