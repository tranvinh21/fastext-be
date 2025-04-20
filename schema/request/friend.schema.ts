import { z } from "zod";

export const addFriendSchema = z.object({
  friendId: z.number(),
});

export const cancelFriendRequestSchema = z.object({
  requestId: z.number(),
});
