import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
	path: ".env",
});

export default defineConfig({
	schema: "./lib/db/schema.ts",
	dialect: "postgresql",
	out: "./drizzle",
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		url: process.env.DATABASE_URL!,
	},
});
