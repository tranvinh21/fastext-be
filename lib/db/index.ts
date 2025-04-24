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
import { env } from "../../config/env";

const client = postgres(env.database.databaseUrl);
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
