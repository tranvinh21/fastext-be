import { z } from "zod";

export const initPrivateConversationSchema = z.object({
	memberIds: z.array(z.number()).length(2),
});

export const createGroupConversationSchema = z.object({
	memberIds: z.array(z.number()).min(2),
	name: z.string().min(1),
});
