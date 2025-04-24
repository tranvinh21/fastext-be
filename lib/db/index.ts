import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";
import {
	conversationMembers,
	conversationMembersRelations,
	conversations,
	conversationsRelations,
	friends,
	friendsRelations,
	messageMedia,
	messageMediaRelations,
	messageReactions,
	messageReactionsRelations,
	messageStatuses,
	messageStatusesRelations,
	messages,
	users,
} from "./schema";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, {
	schema: {
		users,
		friends,
		friendsRelations,
		conversations,
		conversationsRelations,
		conversationMembers,
		conversationMembersRelations,
		messages,
		messageStatuses,
		messageStatusesRelations,
		messageReactions,
		messageReactionsRelations,
		messageMedia,
		messageMediaRelations,
	},
});

export default db;
