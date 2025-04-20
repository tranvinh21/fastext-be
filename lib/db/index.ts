import { drizzle } from "drizzle-orm/postgres-js";
import { friends, users } from "./schema";
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    users,
    friends,
  },
});

export default db;
