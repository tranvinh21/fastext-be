ALTER TABLE "conversation_members" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "conversation_members" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "friends" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "friends" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "friends" ALTER COLUMN "friend_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "friends" ALTER COLUMN "friend_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "friends" ALTER COLUMN "initiator_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "friends" ALTER COLUMN "initiator_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "message_media" ALTER COLUMN "message_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "message_media" ALTER COLUMN "message_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "message_reactions" ALTER COLUMN "message_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "message_reactions" ALTER COLUMN "message_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "message_reactions" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "message_reactions" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "message_statuses" ALTER COLUMN "message_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "message_statuses" ALTER COLUMN "message_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "message_statuses" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "message_statuses" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "conversation_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "conversation_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "user_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "messages" ALTER COLUMN "user_id" DROP NOT NULL;