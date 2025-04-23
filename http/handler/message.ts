import type { Request, Response } from "express";
import { createMessage, createMessageStatus, deleteMessage, getMessageById, getMessages } from "../../lib/db/queries/message";
import type { TokenPayload } from "../service/auth";
import { getConversationById, getConversationMembers, getOrCreateConversation } from "../../lib/db/queries/conversation";
import type { MessagePart } from "../types/message";


export const getMessagesHandler = async (req: Request, res: Response) => {
    const messages = await getMessages(req.query);
    res.json(messages);
};

export const deleteMessageHandler = async (req: Request, res: Response) => {
    const { messageId } = req.params;
    if (!messageId) {
        return res.status(400).json({ error: "Message ID is required" });
    }
    const { userId } = req.user as TokenPayload;

    const message = await getMessageById(Number.parseInt(messageId));

    if (!message) {
        return res.status(404).json({ error: "Message not found" });
    }

    if (message.userId !== userId) {
        return res.status(403).json({ error: "You are not allowed to delete this message" });
    }

    await deleteMessage(Number.parseInt(messageId));
    res.json({ message: "Message deleted successfully" });
};


export const sendMessageHandler = async (req: Request, res: Response) => {
    const { conversationId, message, replyToMessageId } = req.body;
    const { userId } = req.user as TokenPayload;

    const conversation = await getConversationById(conversationId);
    if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
    }

    const parts: MessagePart[] = [{ type: "text", content: message }];
    const newMessage = await createMessage(conversation.id, parts, userId, replyToMessageId);
    if (!newMessage) {
        return res.status(400).json({ error: "Failed to create message" });
    }
    // send socket event to the members
    res.json(newMessage);


    const conversationMembers = await getConversationMembers(conversationId);

    const members = conversationMembers?.map((member) => member.userId);

    if (members) {
        for (const memberId of members) {
            await createMessageStatus(newMessage.id, memberId, "sent");
        }
    }
    // send socket event to the members

};

