import type { Request, Response } from "express";
import { getOrCreateConversation } from "../../lib/db/queries/conversation";
import { getUsersByIds } from "../../lib/db/queries/user";



export const initConversationHandler = async (req: Request, res: Response) => {
	const { memberIds, name } = req.body;
    // Validate memberIds are existing user ids
    const existingUsers = await getUsersByIds(memberIds);
    if (existingUsers.length !== memberIds.length) {
        return res.status(400).json({ error: "Invalid member IDs" });
    }
	const conversation = await getOrCreateConversation(name, memberIds) 
	res.json(conversation);
};


