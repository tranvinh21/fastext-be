import { z } from "zod";

export const getMessageQuerySchema = z.object({
	conversationId: z.string().optional(),
	limit: z.string().optional(),
	offset: z.string().optional(),
});

export const sendMessageSchema = z.object({
	conversationId: z.number(),
	parts: z.array(
		z.object({
			type: z.enum(["text", "image", "audio", "video", "file"]),
			content: z.string(),
		}),
	),
	replyToMessageId: z.number().optional(),
});
