import { drizzle } from "drizzle-orm/postgres-js";
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const db = drizzle(process.env.DATABASE_URL!);

export default db;
