import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../../config/env";
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

export type Database = typeof db;
export default db;
