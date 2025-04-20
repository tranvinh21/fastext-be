import { sql } from "drizzle-orm";
import {
	pgTable,
	serial,
	timestamp,
	unique,
	uniqueIndex,
	varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }).notNull().unique(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export type User = typeof users.$inferSelect;

export const friends = pgTable(
	"friends",
	{
		id: serial("id").primaryKey(),
		userId: serial("user_id").references(() => users.id, {
			onDelete: "cascade",
		}),
		friendId: serial("friend_id").references(() => users.id, {
			onDelete: "cascade",
		}),
		initiatorId: serial("initiator_id").references(() => users.id, {
			onDelete: "cascade",
		}),
		status: varchar("status", { length: 255 }).notNull().default("pending"),
		createdAt: timestamp("created_at").defaultNow(),
		updatedAt: timestamp("updated_at").defaultNow(),
	},
	(table) => {
		return {
			uniqueFriendship: uniqueIndex("unique_friendship").on(
				sql`LEAST(${table.userId}, ${table.friendId})`,
				sql`GREATEST(${table.userId}, ${table.friendId})`,
			),
		};
	},
);

export type Friend = typeof friends.$inferSelect;
