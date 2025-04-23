import { z } from "zod";

export const getMessageQuerySchema = z.object({
    conversationId: z.string().optional(),
    limit: z.number().optional(),
    offset: z.number().optional(),
});

export const sendMessageSchema = z.object({
    conversationId: z.number(),
    message: z.string(),
    replyToMessageId: z.number().optional(),
});


