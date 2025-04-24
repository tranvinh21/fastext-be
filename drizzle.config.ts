import { defineConfig } from "drizzle-kit";
import { env } from "./config/env";


export default defineConfig({
  schema: "./lib/db/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: env.database.databaseUrl,
  },
});
