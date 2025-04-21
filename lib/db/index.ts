import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";
import { friends, users } from "./schema";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, {
	schema: {
		users,
		friends,
	},
});

export default db;
