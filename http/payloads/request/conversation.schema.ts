import { z } from "zod";

export const initPrivateConversationSchema = z.object({
	memberIds: z.array(z.number()).length(2),
});
