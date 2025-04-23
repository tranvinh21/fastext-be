import { z } from "zod";

export const initConversationSchema = z.object({
	memberIds: z.array(z.number()),
	name: z.string(),
});

