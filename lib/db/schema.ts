import {
	boolean,
	integer,
	json,
	pgTable,
	serial,
	timestamp,
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

export const friends = pgTable("friends", {
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
	isCancelled: boolean("is_cancelled").default(false),
	cancelledAt: timestamp("cancelled_at"),
	cancelledBy: integer("cancelled_by"),
});

export type Friend = typeof friends.$inferSelect;

export const conversations = pgTable("conversations", {
	id: serial("id").primaryKey(),
	name: varchar("name", { length: 255 }),
	chatKey: varchar("chat_key", { length: 255 }).notNull(),
	isGroup: boolean("is_group").default(false),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	deletedAt: timestamp("deleted_at"),
});

export type Conversation = typeof conversations.$inferSelect;

export const conversationMembers = pgTable("conversation_members", {
	id: serial("id").primaryKey(),
	conversationId: integer("conversation_id")
		.notNull()
		.references(() => conversations.id, {
			onDelete: "cascade",
		}),
	userId: serial("user_id").references(() => users.id, {
		onDelete: "cascade",
	}),
	nickname: varchar("nickname", { length: 255 }),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
});

export type ConversationMember = typeof conversationMembers.$inferSelect;

export const messages = pgTable("messages", {
	id: serial("id").primaryKey(),
	conversationId: serial("conversation_id").references(() => conversations.id, {
		onDelete: "cascade",
	}),
	parts: json("parts").notNull(),
	userId: serial("user_id").references(() => users.id, {
		onDelete: "cascade",
	}),
	replyToMessageId: integer("reply_to_message_id"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	deletedAt: timestamp("deleted_at"),
});

export type Message = typeof messages.$inferSelect;

export const messageStatuses = pgTable("message_statuses", {
	id: serial("id").primaryKey(),
	messageId: serial("message_id").references(() => messages.id, {
		onDelete: "cascade",
	}),
	userId: serial("user_id").references(() => users.id, {
		onDelete: "cascade",
	}),
	status: varchar("status", { length: 255 }).notNull(),
	seenAt: timestamp("seen_at"),
	createdAt: timestamp("created_at").defaultNow(),
});

export type MessageStatus = typeof messageStatuses.$inferSelect;

export const messageMedia = pgTable("message_media", {
	id: serial("id").primaryKey(),
	messageId: serial("message_id").references(() => messages.id, {
		onDelete: "cascade",
	}),
	type: varchar("type", { length: 255 }).notNull(),
	url: varchar("url", { length: 2048 }).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	metadata: json("metadata"),
});

export type MessageMedia = typeof messageMedia.$inferSelect;

export const messageReactions = pgTable("message_reactions", {
	id: serial("id").primaryKey(),
	messageId: serial("message_id").references(() => messages.id, {
		onDelete: "cascade",
	}),
	userId: serial("user_id").references(() => users.id, {
		onDelete: "cascade",
	}),
	reaction: varchar("reaction", { length: 255 }).notNull(),
	createdAt: timestamp("created_at").defaultNow(),
});

export type MessageReaction = typeof messageReactions.$inferSelect;
